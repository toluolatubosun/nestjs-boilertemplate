import { ApiProperty } from "@nestjs/swagger";
import { Column, CreateDateColumn, Entity, Index, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

export enum UserRole {
    USER = "user",
    SUPER_ADMIN = "super-admin",
}

@Entity()
export class User {
    @ApiProperty()
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @ApiProperty()
    @Column()
    name: string;

    @ApiProperty()
    @Column()
    @Index({ unique: true })
    email: string;

    @ApiProperty()
    @Column({ nullable: true, default: null })
    image: string | null;

    @ApiProperty()
    @Column()
    password: string;

    @ApiProperty()
    @Column({ type: "enum", enum: UserRole, default: UserRole.USER })
    role: UserRole;

    @ApiProperty()
    @Column({ type: "boolean", default: false })
    email_verified: boolean;

    @ApiProperty()
    @Column({ type: "boolean", default: false })
    account_disabled: boolean;

    @ApiProperty()
    @CreateDateColumn()
    created_at: Date;

    @ApiProperty()
    @UpdateDateColumn()
    updated_at: Date;
}
