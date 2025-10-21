import { User } from "../model/user-model";
import { Request } from "express";

export interface UserRequest extends Request {
    user?: User
}