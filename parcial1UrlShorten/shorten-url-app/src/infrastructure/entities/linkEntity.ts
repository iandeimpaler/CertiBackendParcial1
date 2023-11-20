import { Entity, PrimaryGeneratedColumn, Column, IntegerType, JoinColumn, OneToMany, ManyToOne } from "typeorm";
import { ILinkEntity } from '../../domain/entities/ILinkEntity';
import { UserEntity } from "./userEntity";
@Entity()
export class LinkEntity implements ILinkEntity {
    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @Column({ type: 'varchar', unique: true})
    short_url!: string;

    @Column({ type: 'varchar', unique: true})
    long_url!: string;

    @Column({ type: 'timestamp' })
    createdAt!: Date;

    @ManyToOne(() => UserEntity)
    @JoinColumn({ name: 'roleId' })
    user: UserEntity;
}