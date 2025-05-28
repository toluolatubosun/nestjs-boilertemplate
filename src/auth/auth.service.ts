import bcryptjs from "bcryptjs";
import { Repository } from "typeorm";
import { ConfigService } from "@nestjs/config";
import { InjectRepository } from "@nestjs/typeorm";
import { HttpException, HttpStatus, Injectable, NotFoundException } from "@nestjs/common";

import { RegisterDto } from "./dto/register.dto";
import { MailService } from "src/mail/mail.service";
import { User } from "src/users/entities/user.entity";
import { TokenService } from "src/token/token.service";
import { TokenType } from "src/token/entities/token.entity";
import { PasswordResetDto, RequestPasswordResetDto } from "./dto/password-reset.dto";
import { EmailVerificationDto, RequestEmailVerificationDto } from "./dto/email-verification.dto";

@Injectable()
export class AuthService {
    constructor(
        private readonly mailService: MailService,
        private readonly tokenService: TokenService,
        private readonly configService: ConfigService,
        @InjectRepository(User)
        private readonly usersRepository: Repository<User>
    ) {}

    async validateUser(email: string, password: string): Promise<User> {
        const user = await this.usersRepository.findOne({ where: { email } });
        if (!user) throw new NotFoundException("User not found");

        const isPasswordMatching = await bcryptjs.compare(password, user.password);
        if (!isPasswordMatching) throw new HttpException("Invalid credentials", HttpStatus.UNAUTHORIZED);

        return user;
    }

    async register(registerDto: RegisterDto) {
        const existingUser = await this.usersRepository.findOne({ where: { email: registerDto.email } });
        if (existingUser) throw new HttpException("User already exists", HttpStatus.BAD_REQUEST);

        const passwordHash = await bcryptjs.hash(registerDto.password, this.configService.get("CONFIGS.BCRYPT_SALT"));

        const context = {
            name: registerDto.name,
            password: passwordHash,
            email: registerDto.email,
        };

        const user = this.usersRepository.create(context);
        await this.usersRepository.save(user);

        const token = await this.tokenService.generateAuthTokens(user);

        await this.requestEmailVerification({ user_id: user.id });

        return { user, token };
    }

    async login(user: User) {
        const token = await this.tokenService.generateAuthTokens(user);
        return { user, token };
    }

    async requestEmailVerification(requestEmailVerificationDto: RequestEmailVerificationDto) {
        const user = await this.usersRepository.findOne({ where: { id: requestEmailVerificationDto.user_id } });
        if (!user) throw new NotFoundException("User not found");

        if (user.email_verified === true) throw new HttpException("Email already verified", HttpStatus.BAD_REQUEST);

        const verificationOtp = await this.tokenService.generateOtpToken({ user, tokenType: TokenType.EMAIL_VERIFICATION });

        await this.mailService.sendEmailVerificationEmail({ user, verificationToken: verificationOtp.code });

        return true;
    }

    async verifyEmail(emailVerificationDto: EmailVerificationDto) {
        const user = await this.usersRepository.findOne({ where: { id: emailVerificationDto.user_id } });
        if (!user) throw new NotFoundException("User not found");

        if (user.email_verified === true) throw new HttpException("Email already verified", HttpStatus.BAD_REQUEST);

        const isValidToken = await this.tokenService.verifyOtpToken({
            user,
            deleteIfValidated: true,
            tokenType: TokenType.EMAIL_VERIFICATION,
            code: emailVerificationDto.verification_otp,
            token: emailVerificationDto.verification_otp,
        });
        if (!isValidToken) throw new HttpException("Invalid or expired token", HttpStatus.UNAUTHORIZED);

        await this.usersRepository.update({ id: user.id }, { email_verified: true });

        return true;
    }

    async requestPasswordReset(requestResetPasswordDto: RequestPasswordResetDto) {
        const user = await this.usersRepository.findOne({ where: { email: requestResetPasswordDto.email } });
        if (!user) return { user_id: undefined };

        const resetToken = await this.tokenService.generateOtpToken({ user, tokenType: TokenType.PASSWORD_RESET });

        await this.mailService.sendPasswordResetEmail({ user, resetToken: resetToken.code });

        return { user_id: user.id };
    }

    async resetPassword(passwordResetDto: PasswordResetDto) {
        const user = await this.usersRepository.findOne({ where: { id: passwordResetDto.user_id } });
        if (!user) throw new NotFoundException("User not found");

        const isValidToken = await this.tokenService.verifyOtpToken({
            user,
            deleteIfValidated: true,
            code: passwordResetDto.reset_otp,
            token: passwordResetDto.reset_otp,
            tokenType: TokenType.PASSWORD_RESET,
        });
        if (!isValidToken) throw new HttpException("Invalid or expired token", HttpStatus.UNAUTHORIZED);

        const passwordHash = await bcryptjs.hash(passwordResetDto.new_password, this.configService.get("CONFIGS.BCRYPT_SALT"));
        await this.usersRepository.update({ id: user.id }, { password: passwordHash });

        return true;
    }
}
