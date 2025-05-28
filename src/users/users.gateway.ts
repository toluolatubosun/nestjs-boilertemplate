import bcryptjs from "bcryptjs";
import { JwtService } from "@nestjs/jwt";
import { Server, Socket } from "socket.io";
import { ConfigService } from "@nestjs/config";
import { instrument } from "@socket.io/admin-ui";
import { Logger, UseFilters, UsePipes, ValidationPipe } from "@nestjs/common";
import { ConnectedSocket, MessageBody, OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit, SubscribeMessage, WebSocketGateway, WebSocketServer, WsException } from "@nestjs/websockets";

import { UsersService } from "./users.service";
import { DummyMessageDto } from "./dto/user.dto";
import { CONFIGS, DEPLOYMENT_ENV } from "../../configs";
import { WebsocketExceptionsFilter } from "../common/filters/websocket-exception.filter";

@WebSocketGateway({
    cors: {
        credentials: true,
        origin: [...CONFIGS.CORS_ALLOWED_ORIGINS],
    },
})
@UseFilters(WebsocketExceptionsFilter)
@UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
export class UsersGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
    private readonly logger = new Logger(UsersGateway.name);

    @WebSocketServer()
    server: Server;

    constructor(
        private readonly jwtService: JwtService,
        private readonly userService: UsersService,
        private readonly configService: ConfigService
    ) {}

    afterInit() {
        instrument(this.server, {
            auth: {
                type: "basic",
                username: CONFIGS.SOCKET_IO.USERNAME,
                password: bcryptjs.hashSync(CONFIGS.SOCKET_IO.PASSWORD, 10),
            },
            mode: DEPLOYMENT_ENV === "production" ? "production" : "development",
        });

        this.logger.log("UsersGateway initialized.");
    }

    async handleConnection(client: Socket) {
        const authToken = client?.handshake?.auth?.authorization?.split(" ")[1];
        if (!authToken) {
            client.emit("connect_failed", new WsException("Unauthorized"));
            client.disconnect();

            return;
        }

        try {
            const decoded = this.jwtService.verify(authToken, { secret: this.configService.get("CONFIGS.JWT_SECRET") });
            const user = await this.userService.getById(decoded.sub);

            if (!user) {
                client.emit("connect_failed", new WsException("User not found"));
                client.disconnect();
            }
            client.data = { user };

            return;
        } catch (error) {
            client.emit("connect_failed", new WsException("Invalid token"));
            client.disconnect();

            return;
        }
    }

    handleDisconnect(client: Socket) {
        // console.log("Client disconnected", client.data.user);
    }

    @SubscribeMessage("dummy-message")
    async dummyMessage(@ConnectedSocket() client: Socket, @MessageBody() data: DummyMessageDto) {
        client.emit("dummy-message-response", { message: `Hello ${client.data.user.name}, you said ${data.text} :)` });
    }
}
