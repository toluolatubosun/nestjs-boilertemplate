import { Module } from "@nestjs/common";
import { APP_FILTER } from "@nestjs/core";
import { RedisClientOptions } from "redis";
import { ConfigModule } from "@nestjs/config";
import { CacheModule } from "@nestjs/cache-manager";
import * as redisStore from "cache-manager-redis-store";
import { SentryGlobalFilter, SentryModule } from "@sentry/nestjs/setup";

import { AppService } from "./app.service";
import { AwsModule } from "./aws/aws.module";
import { MailModule } from "./mail/mail.module";
import { AuthModule } from "./auth/auth.module";
import { AppController } from "./app.controller";
import { UsersModule } from "./users/users.module";
import { TokenModule } from "./token/token.module";
import configuration, { CONFIGS } from "../configs";
import { CommonModule } from "./common/common.module";
import { DatabaseModule } from "./database/database.module";

@Module({
    imports: [SentryModule.forRoot(), CacheModule.register<RedisClientOptions>({ isGlobal: true, store: redisStore, url: CONFIGS.REDIS_URI }), MailModule, UsersModule, DatabaseModule, AwsModule, AuthModule, TokenModule, ConfigModule.forRoot({ isGlobal: true, load: [configuration] }), CommonModule],
    controllers: [AppController],
    providers: [{ provide: APP_FILTER, useClass: SentryGlobalFilter }, AppService],
})
export class AppModule {}
