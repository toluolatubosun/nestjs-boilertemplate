import { IsNotEmpty, IsString } from "class-validator";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class PasswordResetDto {
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    user_id: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    new_password: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    reset_otp: string;
}

export class RequestPasswordResetDto {
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    email: string;
}

export class RequestPasswordResetResponseDto {
    @ApiPropertyOptional({ type: String })
    user_id?: string;
}
