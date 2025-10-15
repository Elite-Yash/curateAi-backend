import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    UpdateDateColumn,
    DeleteDateColumn,
} from "typeorm";

// Enum for comment_type
export enum CommentType {
    COMMENT_REPLY = "comment-reply",
    COMMENT = "comment",
    ARTICLE_COMMENT = "article-comment",
    ARTICLE_COMMENT_REPLY = "article-comment-reply",
    MESSAGE_REPLY = "message-reply",
    CREATE_POST = "create-post",
}

// Enum for status
export enum CommentStatus {
    SAVED = "saved",
    PUBLISHED = "published",
}

@Entity("comments")
export class Comment {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: "varchar", length: 255, nullable: true })
    post_url: string | null;

    @Column({
        type: "enum",
        enum: CommentType,
    })
    comment_type: CommentType;

    @Column({ type: "text" })
    comment: string;

    @Column()
    user_id: number;

    // ✅ New columns
    @Column({ type: "varchar", length: 255, nullable: true })
    motive: string | null;

    @Column({ type: "varchar", length: 255, nullable: true })
    tone: string | null;

    @Column({ type: "varchar", length: 255, nullable: true })
    language: string | null;

    @Column({
        type: "enum",
        enum: CommentStatus,
        nullable: true,
    })
    status: CommentStatus | null;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;

    @DeleteDateColumn()
    deleted_at?: Date;

    @Column({ type: "boolean", default: false })
    is_comment_posted: boolean;

    @Column({ type: "text", nullable: true })
    genarate_title: string | null;
}