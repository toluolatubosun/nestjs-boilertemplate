import "./sentry";

import { NestFactory } from "@nestjs/core";
import { CONFIGS, APP_VERSION } from "../configs";
import { ValidationPipe, VersioningType } from "@nestjs/common";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";

import { AppModule } from "./app.module";
import { RedisIoAdapter } from "./common/adapters/redis-adapter";
import { AllExceptionFilter } from "./common/filters/all-exception.filter";

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    const redisIoAdapter = new RedisIoAdapter(app);
    await redisIoAdapter.connectToRedis();

    app.useWebSocketAdapter(redisIoAdapter);
    app.enableCors({ credentials: true, origin: [...CONFIGS.CORS_ALLOWED_ORIGINS] });
    app.enableVersioning({ type: VersioningType.URI });
    app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
    app.useGlobalFilters(new AllExceptionFilter());

    const swaggerConfig = new DocumentBuilder().setTitle(CONFIGS.APP_NAME).setDescription(CONFIGS.APP_DESCRIPTION).setVersion(APP_VERSION).addBearerAuth().build();
    const swaggerDocument = SwaggerModule.createDocument(app, swaggerConfig);
    SwaggerModule.setup("/docs", app, swaggerDocument);

    await app.listen(process.env.PORT || 4000);
}
bootstrap();
