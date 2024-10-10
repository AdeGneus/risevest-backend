import { Response } from "express";
import config from "../config";
import { User } from "../entities/user.entity";
import { signToken } from "./jwt";

export const createSendToken = (
  user: Partial<User>,
  statusCode: number,
  message: string,
  res: Response,
) => {
  const accessToken = signToken(user.id, "accessTokenPrivateKey", {
    expiresIn: config["accessTokenTtl"],
  });

  res.status(statusCode).json({
    status: "success",
    message,
    data: { user },
    tokens: { accessToken },
  });
};
