export interface UserDto {
    id: string;
    email: string;
    lastLogin: Date | null;
    token: string | null;
    numberOfLinks: number;
}