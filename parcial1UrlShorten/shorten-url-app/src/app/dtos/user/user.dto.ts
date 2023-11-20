export interface UserDto {
    id: string;
    email: string;
    lastLogin: Date | null;
    numberOfLinks: number;
}