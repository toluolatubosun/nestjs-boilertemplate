import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class RequestEmailVerificationDto {
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    user_id: string;
}

export class EmailVerificationDto {
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    verification_otp: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    user_id: string;
}
