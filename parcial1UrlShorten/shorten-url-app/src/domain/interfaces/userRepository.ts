import { DeleteResult } from "typeorm";
import { User } from "../models/user";

export interface UserRepository {
    findById(id: string): Promise<User | null>;
    createUser(user: User): Promise<User>;
    updateUser(user: User, id: string): Promise<User>;
    deleteUser(id: string): Promise<DeleteResult>;
    findByEmail(email: string): Promise<User | null>;
}