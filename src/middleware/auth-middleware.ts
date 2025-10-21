import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { ResponseError } from "../error/response-error";
import { mysqlDb } from "../application/database";
import { UserRequest } from "../type/user-request";

interface JwtPayload {
  username: string;
}

export const authMiddleware = async (req: UserRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers["authorization"];

  // Format: Authorization: Bearer <token>
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) {
    throw new ResponseError(401, "Missing Token")
  }

  try {
    const secret = process.env.JWT_SECRET as string;
    const decoded = jwt.verify(token, secret) as JwtPayload;

    const user = await mysqlDb("users")
    .select("username", "name")
    .where("username", decoded.username)
    .first();

    req.user = user;
    next();
  } catch (err) {
    res.status(401).json({ message: "Invalid or expired token" }).end();
  }
};
