import { NextFunction, Request, Response } from "express";
import { User } from "../entities/user.entity";
import { UnauthorizedError } from "../exceptions/unauthorizedError";
import { verifyToken } from "../utils/jwt";
import asyncHandler from "./asyncHandler";

const extractTokens = (req: Request) => {
  const accessToken = req.headers.authorization?.split(" ")[1];

  if (!accessToken) {
    throw new UnauthorizedError("Missing tokens. Please log in.");
  }
  return { accessToken };
};

const checkUserExists = async (userId: string) => {
  const user = await User.findOne({ where: { id: userId } });

  if (!user) {
    throw new UnauthorizedError("User not found. Please log in.");
  }

  return user;
};

export const deserializeUser = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { accessToken } = extractTokens(req);

    const decoded = verifyToken(accessToken, "accessTokenPublicKey");
    const currentUser = await checkUserExists(decoded.id);

    req.user = currentUser;
    return next();
  },
);
