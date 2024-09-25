import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { PassportModule } from "@nestjs/passport";

import { AuthService } from "./auth.service";
import { MailModule } from "src/mail/mail.module";
import { AuthController } from "./auth.controller";
import { TokenModule } from "src/token/token.module";
import { UsersModule } from "src/users/users.module";
import { User } from "src/users/entities/user.entity";
import { JwtStrategy } from "./strategies/jwt.strategy";
import { LocalStrategy } from "./strategies/local.strategy";
import { JwtRefreshStrategy } from "./strategies/jwt-refresh.strategy";

@Module({
    imports: [TypeOrmModule.forFeature([User]), PassportModule, TokenModule, UsersModule, MailModule],
    providers: [AuthService, JwtStrategy, JwtRefreshStrategy, LocalStrategy],
    controllers: [AuthController],
})
export class AuthModule {}
