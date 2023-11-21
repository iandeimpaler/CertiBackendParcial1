import { Entity, PrimaryGeneratedColumn, Column, IntegerType, JoinColumn, OneToMany, ManyToOne } from "typeorm";
import { ILinkEntity } from '../../domain/entities/ILinkEntity';
import { UserEntity } from "./userEntity";
@Entity()
export class LinkEntity implements ILinkEntity {
    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @Column({ type: 'varchar', unique: true})
    shortUrl!: string;

    @Column({ type: 'varchar'})
    longUrl!: string;

    @Column({ type: 'timestamp' })
    createdAt!: Date;

    @ManyToOne(() => UserEntity)
    @JoinColumn({ name: 'roleId' })
    user: UserEntity;
}