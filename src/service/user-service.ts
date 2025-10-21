import { CreateUserRequest, toUserResponse, UserResponse } from "../model/user-model";
import { UserValidation } from "../validation/user-validation";
import { Validation } from "../validation/validation";
import { mysqlDb } from "../application/database";
import { logger } from "../application/logging";
import { ResponseError } from "../error/response-error";
import bcrypt from "bcrypt";

export class UserService {
    static async register(request: CreateUserRequest): Promise<UserResponse> {
        const registerRequest = Validation.validate(UserValidation.REGISTER, request);

        const existingCount = await mysqlDb("users")
            .where("username", registerRequest.username)
            .count<{ count: number }>("username as count")
            .first();

        if (existingCount && Number(existingCount.count) > 0) {
            throw new ResponseError(400, "Username already exists");
        }

        const hashedPassword = await bcrypt.hash(registerRequest.password, 10);

        // Insert user baru
        await mysqlDb("users")
        .insert({
            name: registerRequest.name,
            username: registerRequest.username,
            password: hashedPassword,
        })

        const user = await mysqlDb("users")
        .where("username", registerRequest.username).first();

        return toUserResponse(user);

    }
}