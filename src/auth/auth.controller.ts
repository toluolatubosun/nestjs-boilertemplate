import { ApiBody, ApiOperation, ApiTags } from "@nestjs/swagger";
import { Body, Request, Controller, Post, UseGuards, HttpStatus, HttpCode } from "@nestjs/common";

import { LoginDto } from "./dto/login.dto";
import { AuthService } from "./auth.service";
import { RegisterDto } from "./dto/register.dto";
import { User } from "src/users/entities/user.entity";
import { TokenService } from "src/token/token.service";
import { LocalAuthGuard } from "./guards/local-auth.guard";
import { JwtRefreshGuard } from "./guards/jwt-refresh.guard";
import { HttpResponse } from "src/common/dto/http-response.dto";
import { RequestWithUser, RequestWithUserAndToken } from "./interfaces/request.interface";
import { AuthTokensDto, RefreshTokenDto, AuthenticationResponseDto } from "./dto/auth.dto";
import { ApiHttpErrorResponses, ApiHttpResponse } from "src/common/decorators/custom-decorator";
import { EmailVerificationDto, RequestEmailVerificationDto } from "./dto/email-verification.dto";
import { PasswordResetDto, RequestPasswordResetDto, RequestPasswordResetResponseDto } from "./dto/password-reset.dto";

@ApiTags("Authentication")
@Controller({ path: "auth", version: "1" })
export class AuthController {
    constructor(
        private readonly authService: AuthService,
        private readonly tokenService: TokenService
    ) {}

    @ApiOperation({ summary: "Register" })
    @ApiHttpErrorResponses()
    @ApiHttpResponse({ status: 201, type: AuthenticationResponseDto, description: "Registers a new user" })
    @Post("register")
    async register(@Body() registerDto: RegisterDto) {
        const result = await this.authService.register(registerDto);
        return new HttpResponse("User registered", result, HttpStatus.CREATED);
    }

    @ApiOperation({ summary: "Login" })
    @ApiHttpErrorResponses()
    @ApiBody({ type: LoginDto })
    @ApiHttpResponse({ status: 200, type: AuthenticationResponseDto, description: "Logs in a user" })
    @HttpCode(200)
    @Post("login")
    @UseGuards(LocalAuthGuard)
    async login(@Request() req: RequestWithUser) {
        const result = await this.authService.login(req.user);
        return new HttpResponse("User logged in", result, HttpStatus.OK);
    }

    @ApiOperation({ summary: "Refresh Tokens" })
    @ApiHttpErrorResponses()
    @ApiBody({ type: RefreshTokenDto })
    @ApiHttpResponse({ status: 200, type: AuthTokensDto, description: "Refreshes the access token and refresh token" })
    @HttpCode(200)
    @Post("refresh-tokens")
    @UseGuards(JwtRefreshGuard)
    async refreshTokens(@Request() req: RequestWithUserAndToken) {
        const result = await this.tokenService.refreshAuthTokens(req.user.user, req.user.token);
        return new HttpResponse("Tokens refreshed", result, HttpStatus.OK);
    }

    @ApiOperation({ summary: "Logout" })
    @ApiHttpErrorResponses()
    @ApiBody({ type: RefreshTokenDto })
    @ApiHttpResponse({ status: 200, type: Boolean, description: "Logs out a user, by revoking the refresh token" })
    @HttpCode(200)
    @Post("logout")
    @UseGuards(JwtRefreshGuard)
    async logout(@Request() req: RequestWithUserAndToken) {
        const result = await this.tokenService.revokeRefreshToken(req.user.user, req.user.token);
        return new HttpResponse("User logged out", result, HttpStatus.OK);
    }

    @ApiOperation({ summary: "Request Email Verification" })
    @ApiHttpErrorResponses()
    @ApiBody({ type: RequestEmailVerificationDto })
    @ApiHttpResponse({ status: 200, type: Boolean, description: "Requests email verification for a user" })
    @HttpCode(200)
    @Post("request-email-verification")
    async requestEmailVerification(@Body() requestEmailVerificationDto: RequestEmailVerificationDto) {
        const result = await this.authService.requestEmailVerification(requestEmailVerificationDto);
        return new HttpResponse("Email verification requested", result, HttpStatus.OK);
    }

    @ApiOperation({ summary: "Verify Email" })
    @ApiHttpErrorResponses()
    @ApiBody({ type: EmailVerificationDto })
    @ApiHttpResponse({ status: 200, type: Boolean, description: "Verifies the email of a user" })
    @HttpCode(200)
    @Post("verify-email")
    async verifyEmail(@Body() emailVerificationDto: EmailVerificationDto) {
        const result = await this.authService.verifyEmail(emailVerificationDto);
        return new HttpResponse("Email verified", result, HttpStatus.OK);
    }

    @ApiOperation({ summary: "Request Password Reset" })
    @ApiHttpErrorResponses()
    @ApiBody({ type: RequestPasswordResetDto })
    @ApiHttpResponse({ status: 200, type: RequestPasswordResetResponseDto, description: "Requests password reset for a user" })
    @HttpCode(200)
    @Post("request-password-reset")
    async requestPasswordReset(@Body() requestResetPasswordDto: RequestPasswordResetDto) {
        const result = await this.authService.requestPasswordReset(requestResetPasswordDto);
        return new HttpResponse("Password reset requested", result, HttpStatus.OK);
    }

    @ApiOperation({ summary: "Reset Password" })
    @ApiHttpErrorResponses()
    @ApiBody({ type: PasswordResetDto })
    @ApiHttpResponse({ status: 200, type: Boolean, description: "Resets the password of a user" })
    @HttpCode(200)
    @Post("reset-password")
    async resetPassword(@Body() passwordResetDto: PasswordResetDto) {
        const result = await this.authService.resetPassword(passwordResetDto);
        return new HttpResponse("Password reset", result, HttpStatus.OK);
    }
}
