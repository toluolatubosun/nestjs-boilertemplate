import { User } from "src/users/entities/user.entity";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

export enum TokenType {
    REFRESH_TOKEN = "refresh-token",
    PASSWORD_RESET = "password-reset",
    EMAIL_VERIFICATION = "email-verification",
}

@Entity()
export class Token {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column({ nullable: true, default: null })
    code: string | null;

    @Column({ nullable: true, default: null })
    token: string | null;

    @Column({ type: "enum", enum: TokenType })
    type: TokenType;

    @ManyToOne(() => User, { onDelete: "CASCADE", eager: true })
    user: User;

    @Column({ type: "timestamp" })
    expires_at: Date;
}
