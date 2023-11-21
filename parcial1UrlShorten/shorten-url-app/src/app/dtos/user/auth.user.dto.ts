export interface UserAuthDto {
    id: string;
    email: string;
    lastLogin: Date | null;
    token: string | null; 
}