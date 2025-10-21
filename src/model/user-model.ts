
export interface User {
  name: string;
  username: string;
  password: string;
}

export type UserResponse = {
    username: string;
    name: string;
    token?: string;
}

export type CreateUserRequest = {
    username: string;
    name: string;
    password: string;
}

export type LoginUserRequest = {
    username: string;
    password: string;
}

export type UpdateUserRequest = {
    name?: string | undefined;
    password?: string | undefined;
}

export function toUserResponse(user: User): UserResponse {
    return {
        name: user.name,
        username: user.username
    }
}