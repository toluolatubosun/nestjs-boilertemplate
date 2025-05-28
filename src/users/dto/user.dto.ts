import { ApiProperty } from "@nestjs/swagger";
import { User } from "../entities/user.entity";
import { IsNotEmpty, IsOptional, IsString } from "class-validator";
import { PaginationResponseDto } from "src/common/dto/pagination.dto";

export class UpdateUserDto {
    @ApiProperty({ required: false })
    @IsOptional()
    @IsString()
    name?: string;

    @ApiProperty({ required: false, type: "string", format: "binary" })
    @IsOptional()
    file?: Express.Multer.File;
}

export class GetAllUsersResponseDto {
    @ApiProperty({ isArray: true, type: User })
    users: User[];

    @ApiProperty()
    pagination: PaginationResponseDto;
}

export class DummyMessageDto {
    @IsString()
    @IsNotEmpty()
    text: string;
}
