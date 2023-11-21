import { DeleteResult } from "typeorm";
import { Link } from "../models/link";

export interface LinkRepository {
    findById(id: string): Promise<Link | null>;
    createLink(user: Link): Promise<Link>;
    deleteLink(id: string): Promise<DeleteResult>;
}