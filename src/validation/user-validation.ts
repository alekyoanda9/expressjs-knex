import { z, ZodType } from "zod";
import { CreateUserRequest, LoginUserRequest, UpdateUserRequest } from "../model/user-model";

export class UserValidation {
    static readonly REGISTER: ZodType<CreateUserRequest> = z.object({
        username: z.string().min(1).max(100),
        name: z.string().min(1).max(100),
        password: z.string().min(1).max(100)
    });
    
    static readonly LOGIN: ZodType<LoginUserRequest> = z.object({
        username: z.string().min(1).max(100),
        password: z.string().min(1).max(100)
    });

    static readonly UPDATE: ZodType<UpdateUserRequest> = z.object({
        name: z.string().min(1).max(100).optional(),
        password: z.string().min(1).max(100).optional()
    })
}