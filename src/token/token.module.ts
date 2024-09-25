import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { TypeOrmModule } from "@nestjs/typeorm";

import { TokenService } from "./token.service";
import { Token } from "./entities/token.entity";

@Module({
    imports: [JwtModule.register({}), TypeOrmModule.forFeature([Token])],
    providers: [TokenService],
    exports: [TokenService],
})
export class TokenModule {}
