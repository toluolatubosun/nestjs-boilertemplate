import { FileInterceptor } from "@nestjs/platform-express";
import { ApiBearerAuth, ApiConsumes, ApiOperation, ApiTags } from "@nestjs/swagger";
import { Request, Controller, Get, UseGuards, HttpStatus, Patch, Body, UseInterceptors, UploadedFile, ParseFilePipeBuilder } from "@nestjs/common";

import { CONFIGS } from "../../configs";
import { User } from "./entities/user.entity";
import { UsersService } from "./users.service";
import { JWTRoleGuard } from "src/auth/guards/jwt-role.guard";
import { JwtAuthGuard } from "src/auth/guards/jwt-auth.guard";
import { PaginationDto } from "src/common/dto/pagination.dto";
import { HttpResponse } from "src/common/dto/http-response.dto";
import { GetAllUsersResponseDto, UpdateUserDto } from "./dto/user.dto";
import { RequestWithUser } from "src/auth/interfaces/request.interface";
import { ApiHttpErrorResponses, ApiHttpResponse, ApiPaginationQuery, PaginationQuery } from "src/common/decorators/custom-decorator";

@ApiTags("Users")
@Controller({ path: "users", version: "1" })
export class UsersController {
    constructor(private readonly usersService: UsersService) {}

    @ApiOperation({ summary: "Get User Session" })
    @ApiBearerAuth()
    @ApiHttpErrorResponses()
    @ApiHttpResponse({ status: 200, type: User, description: "Returns the user session" })
    @Get("session")
    @UseGuards(JwtAuthGuard)
    async getUserSession(@Request() req: RequestWithUser) {
        return new HttpResponse("User session", req.user, HttpStatus.OK);
    }

    @ApiOperation({ summary: "Update User Profile" })
    @ApiBearerAuth()
    @ApiHttpErrorResponses()
    @ApiHttpResponse({ status: 200, type: User, description: "Updates the user profile" })
    @Patch("update-profile")
    @ApiConsumes("multipart/form-data")
    @UseInterceptors(FileInterceptor("file"))
    @UseGuards(JWTRoleGuard(CONFIGS.APP_ROLES.USER))
    async updateUserProfile(
        @Request() req: RequestWithUser,
        @Body() updateUserDto: UpdateUserDto,
        @UploadedFile(new ParseFilePipeBuilder().addFileTypeValidator({ fileType: "image/*" }).addMaxSizeValidator({ maxSize: 100000 }).build({ fileIsRequired: false, errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY })) file: Express.Multer.File
    ) {
        const result = await this.usersService.updateUserProfile(req.user, { ...updateUserDto, file });
        return new HttpResponse("User profile updated", result, HttpStatus.OK);
    }

    @ApiOperation({ summary: "Get All Users" })
    @ApiBearerAuth()
    @ApiPaginationQuery()
    @ApiHttpErrorResponses()
    @ApiHttpResponse({ status: 200, type: GetAllUsersResponseDto, description: "Returns all users" })
    @Get("all")
    @UseGuards(JWTRoleGuard(CONFIGS.ADMIN_ROLES.SUPER_ADMIN))
    async getAllUsers(@PaginationQuery() paginationDto: PaginationDto) {
        const result = await this.usersService.getAllUsers(paginationDto);
        return new HttpResponse("All users", result, HttpStatus.OK);
    }
}
