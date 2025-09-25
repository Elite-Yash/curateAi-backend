import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, DeleteDateColumn } from "typeorm";

@Entity({ name: "csv_profiles" })
export class CsvProfile {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: "varchar", length: 255 })
    profile_name: string;

    @Column({ type: "varchar", length: 255, nullable: true })
    profile_img?: string;

    @Column({ type: "varchar", length: 255 })
    profile_url: string;

    @Column({ type: "varchar", length: 255 })
    profile_id: string;

    @Column({ type: "int" })
    campaign_id: number;

    @Column({ type: "int" })
    user_id: number;

    @CreateDateColumn({ type: "timestamp", name: "created_at" })
    created_at: Date;

    @UpdateDateColumn({ type: "timestamp", name: "updated_at" })
    updated_at: Date;

    @DeleteDateColumn({ type: "timestamp", name: "deleted_at", nullable: true })
    deleted_at?: Date;
}
