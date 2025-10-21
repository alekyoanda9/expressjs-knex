import { CreateUserRequest, LoginUserRequest, toUserResponse, UpdateUserRequest, User, UserResponse } from "../model/user-model";
import { UserValidation } from "../validation/user-validation";
import { Validation } from "../validation/validation";
import { mysqlDb } from "../application/database";
import { ResponseError } from "../error/response-error";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

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
    static async login(request: LoginUserRequest): Promise<UserResponse> {
        const loginRequest = Validation.validate(UserValidation.LOGIN, request);

        let user = await mysqlDb("users")
        .select("username", "password")
        .where("username", loginRequest.username)
        .first()

        if (!user) {
            throw new ResponseError(400, "Username or password incorrect")
        }

        const isPasswordValid = await bcrypt.compare(loginRequest.password, user.password);
        if (!isPasswordValid) {
            throw new ResponseError(401, "Username or password is wrong");
        }

        // generate token baru
        const token = jwt.sign(
            { username: user.username },
            process.env.JWT_SECRET as string,
            { expiresIn: "1m" }
        );

        await mysqlDb("users")
        .where("username", loginRequest.username)
        .update({ token: token });

        user = await mysqlDb("users")
        .select("username", "name")
        .where("username", loginRequest.username)
        .first();

        const response = toUserResponse(user);
        response.token = token;

        return response;
    }
    
    static async get(user: User): Promise<UserResponse>{
        return toUserResponse(user);
    }

    static async update(user: User, request: UpdateUserRequest): Promise<UserResponse> {
        const updateRequest = Validation.validate(UserValidation.UPDATE, request);

        if (updateRequest.name) {
            user.name = updateRequest.name;
        }

        if (updateRequest.password) {
            user.password = await bcrypt.hash(updateRequest.password, 10);
        }

        await mysqlDb("users")
        .where("username", user.username)
        .update(user);

        return toUserResponse(user);
    }

    static async logout(user: User): Promise<UserResponse> {
        await mysqlDb("users")
        .where("username", user.username)
        .update({
            token: null
        });
        const result = toUserResponse(user);
        result.token = "";
        return result;
    }
}