import { Module } from "@nestjs/common";
import { RedisClientOptions } from "redis";
import { ConfigModule } from "@nestjs/config";
import { ScheduleModule } from "@nestjs/schedule";
import { CacheModule } from "@nestjs/cache-manager";
import { APP_FILTER, APP_GUARD } from "@nestjs/core";
import * as redisStore from "cache-manager-redis-store";
import { ThrottlerGuard, ThrottlerModule } from "@nestjs/throttler";
import { SentryGlobalFilter, SentryModule } from "@sentry/nestjs/setup";
import { ThrottlerStorageRedisService } from "@nest-lab/throttler-storage-redis";

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
    imports: [
        SentryModule.forRoot(),
        ScheduleModule.forRoot(),
        ThrottlerModule.forRoot({ throttlers: [{ ttl: 600000, limit: 100 }], storage: new ThrottlerStorageRedisService(CONFIGS.REDIS_URI) }), // (100 requests per 10 minutes)
        CacheModule.register<RedisClientOptions>({ isGlobal: true, store: redisStore, url: CONFIGS.REDIS_URI }),
        MailModule,
        UsersModule,
        DatabaseModule,
        AwsModule,
        AuthModule,
        TokenModule,
        ConfigModule.forRoot({ isGlobal: true, load: [configuration] }),
        CommonModule,
    ],
    controllers: [AppController],
    providers: [{ provide: APP_FILTER, useClass: SentryGlobalFilter }, { provide: APP_GUARD, useClass: ThrottlerGuard }, AppService],
})
export class AppModule {}
