import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { render } from "@react-email/components";
import { MailerService } from "@nestjs-modules/mailer";

import { User } from "src/users/entities/user.entity";
import PasswordResetEmail from "./templates/v1/password-reset-email";
import EmailVerificationLinkEmail from "./templates/v1/email-verification-email";

@Injectable()
export class MailService {
    constructor(
        private mailerService: MailerService,
        private readonly configService: ConfigService
    ) {}

    async sendEmailVerificationEmail(context: { user: Pick<User, "id" | "name" | "email">; verificationToken: string }) {
        const emailProp = {
            name: context.user.name,
            verificationOTP: context.verificationToken,
        };

        return await this.mailerService.sendMail({
            from: this.configService.get("CONFIGS.MAILER.FROM_EMAIL"),
            to: context.user.email,
            subject: "Verify your email address",
            text: render(EmailVerificationLinkEmail(emailProp), { plainText: true }),
            html: render(EmailVerificationLinkEmail(emailProp)),
        });
    }

    async sendPasswordResetEmail(context: { user: Pick<User, "id" | "name" | "email">; resetToken: string }) {
        const emailProp = {
            name: context.user.name,
            resetOTP: context.resetToken,
        };

        return await this.mailerService.sendMail({
            from: this.configService.get("CONFIGS.MAILER.FROM_EMAIL"),
            to: context.user.email,
            subject: "Reset your password",
            text: render(PasswordResetEmail(emailProp), { plainText: true }),
            html: render(PasswordResetEmail(emailProp)),
        });
    }
}
