import { ConfigService } from "@nestjs/config";
import { Injectable, Logger } from "@nestjs/common";

@Injectable()
export class AppService {
    private readonly logger = new Logger(AppService.name);

    constructor(private configService: ConfigService) {}

    getHello(): string {
        this.logger.log("::> Hello World! Server was pinged.");
        return `Welcome to ${this.configService.get("CONFIGS.APP_NAME")}. Hello World!`;
    }
}
