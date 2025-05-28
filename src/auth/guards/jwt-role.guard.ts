import { ExecutionContext, HttpException, mixin } from "@nestjs/common";

import { JwtAuthGuard } from "./jwt-auth.guard";
import { User } from "src/users/entities/user.entity";

export const JWTRoleGuard = (roles: string[]) => {
    class RoleGuardMixin extends JwtAuthGuard {
        async canActivate(context: ExecutionContext) {
            await super.canActivate(context);

            const request = context.switchToHttp().getRequest();
            const user: User = request.user;

            if (!user) return false;

            if (user.account_disabled) throw new HttpException("Account disabled", 403);
            if (!user.email_verified) throw new HttpException("Email not verified", 403);

            return roles.includes(user.role);
        }
    }

    return mixin(RoleGuardMixin);
};
