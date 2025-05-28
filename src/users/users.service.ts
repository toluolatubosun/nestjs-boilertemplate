import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { Injectable, NotFoundException } from "@nestjs/common";

import { User } from "./entities/user.entity";
import { ConfigService } from "@nestjs/config";
import { UpdateUserDto } from "./dto/user.dto";
import { AwsService } from "src/aws/aws.service";
import { PaginationDto, PaginationResponseDto } from "src/common/dto/pagination.dto";

@Injectable()
export class UsersService {
    constructor(
        private readonly awsService: AwsService,
        private readonly configService: ConfigService,
        @InjectRepository(User)
        private readonly usersRepository: Repository<User>
    ) {}

    async getById(id: string): Promise<User | null> {
        const user = await this.usersRepository.findOne({ where: { id } });
        return user;
    }

    async updateUserProfile(user: User, updateUserDto: UpdateUserDto) {
        const foundUser = await this.usersRepository.findOne({ where: { id: user.id } });
        if (!foundUser) throw new NotFoundException("User not found");

        const dataToUpdate: Record<string, any> = {
            name: updateUserDto.name,
        };

        if (updateUserDto.file) {
            // Upload the file to S3
            const image = await this.awsService.uploadFileToS3({
                folder: "users",
                ACL: "public-read",
                file: updateUserDto.file,
                s3Bucket: this.configService.get("CONFIGS.AWS.S3_BUCKET"),
            });
            if (image) dataToUpdate.image = image;

            // Delete the old file from S3
            if (foundUser.image) {
                await this.awsService.deleteFileFromS3({ s3Bucket: this.configService.get("CONFIGS.AWS.S3_BUCKET"), Location: foundUser.image });
            }
        }

        return await this.usersRepository.save({ ...foundUser, ...dataToUpdate });
    }

    async getAllUsers(paginationDto: PaginationDto) {
        const users = await this.usersRepository.find({
            take: paginationDto.limit,
            skip: (paginationDto.page - 1) * paginationDto.limit,
        });

        const total = await this.usersRepository.count();

        const pagination: PaginationResponseDto = {
            total_docs: total,
            page: paginationDto.page,
            limit: paginationDto.limit,
            total_pages: Math.ceil(total / paginationDto.limit),
        };

        return { users, pagination };
    }
}
