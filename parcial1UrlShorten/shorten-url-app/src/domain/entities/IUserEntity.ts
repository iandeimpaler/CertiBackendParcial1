
export interface IUserEntity {
    id?: string;
    email: string;
    password: string;
    createdAt: Date;
    lastLogin: Date | null;
    numberOfLinks: number;
}