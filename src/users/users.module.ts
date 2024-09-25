import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { TypeOrmModule } from "@nestjs/typeorm";

import { User } from "./entities/user.entity";
import { UsersService } from "./users.service";
import { UsersGateway } from "./users.gateway";
import { AwsModule } from "src/aws/aws.module";
import { UsersController } from "./users.controller";

@Module({
    imports: [JwtModule.register({}), TypeOrmModule.forFeature([User]), AwsModule],
    controllers: [UsersController],
    providers: [UsersService, UsersGateway],
    exports: [UsersService],
})
export class UsersModule {}
