import { ApiProperty } from "@nestjs/swagger";

import { User } from "src/users/entities/user.entity";

export class AuthTokensDto {
    @ApiProperty()
    access_token: string;

    @ApiProperty()
    refresh_token: string;
}

export class AuthenticationResponseDto {
    @ApiProperty()
    user: User;

    @ApiProperty()
    token: AuthTokensDto;
}

export class RefreshTokenDto {
    @ApiProperty()
    refresh_token: string;
}
