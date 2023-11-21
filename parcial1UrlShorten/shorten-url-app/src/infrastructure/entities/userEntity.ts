import { Entity, PrimaryGeneratedColumn, Column, IntegerType, JoinColumn, OneToMany } from "typeorm";
import { IUserEntity } from '../../domain/entities/IUserEntity';
@Entity()
export class UserEntity implements IUserEntity {
    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @Column({ type: 'varchar', unique: true})
    email!: string;

    @Column({ type: 'varchar'})
    password!: string;

    @Column({ type: 'timestamp' })
    createdAt!: Date;

    @Column({ type: 'timestamp', nullable: true })
    lastLogin!: Date;

    @Column({ type: 'int'})
    numberOfLinks!: number;
}