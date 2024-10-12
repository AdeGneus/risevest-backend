import { Request, Response } from "express";
import asyncHandler from "../middlewares/asyncHandler";
import { UserService } from "../services/user.service";

const userService = new UserService();

export const getAllUsers = asyncHandler(async (req: Request, res: Response) => {
  const users = await userService.getAllUsers();

  res.status(200).json({
    status: "success",
    message: "User records fetched successfully",
    data: { users },
  });
});

export const getUserById = asyncHandler(async (req: Request, res: Response) => {
  const user = await userService.getUserById(req.params.id);
  res.status(200).json({
    status: "success",
    message: "User fetched successfully",
    data: { user },
  });
});
