import "reflect-metadata";
import { DataSource } from "typeorm";
import { db } from '../../infrastructure/config/config';
import { UserEntity } from "../entities/userEntity";
import { LinkEntity } from "../entities/linkEntity";

export const AppDataSource = new DataSource({
    type: db.type as "mysql" | "mariadb",
    host: db.host,
    port: db.port as number,
    username: db.username,
    password: db.password,
    database: db.database,
    synchronize: true,
    logging: false,
    entities: [UserEntity, LinkEntity],
    subscribers: [],
    migrations: [],
});