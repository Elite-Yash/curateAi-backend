import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, CreateDateColumn, UpdateDateColumn, DeleteDateColumn } from "typeorm";

@Entity("comments")
export class Comment {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: "varchar", length: 255, nullable: true })
    post_url: string | null;

    @Column({
        type: "enum",
        enum: [
            "comment-reply",
            "comment",
            "article-comment",
            "article-comment-reply",
            "message-reply",
            "create-post",
        ],
    })
    comment_type: string;

    @Column({ type: "text" })
    comment: string;

    @Column()
    user_id: number;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;

    @DeleteDateColumn()
    deleted_at?: Date;

    @Column({ type: "boolean", default: false })
    is_comment_posted: boolean;
}
