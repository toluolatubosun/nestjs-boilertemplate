import { Strategy } from "passport-local";
import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";

import { AuthService } from "../auth.service";

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
    constructor(private authService: AuthService) {
        super({
            usernameField: "email",
            passwordField: "password",
        });
    }

    async validate(username: string, password: string): Promise<any> {
        return await this.authService.validateUser(username, password);
    }
}
