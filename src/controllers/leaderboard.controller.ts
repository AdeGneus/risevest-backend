import { Request, Response } from "express";
import asyncHandler from "../middlewares/asyncHandler";
import { LeaderboardService } from "../services/leaderboard.service";

const leaderboardService = new LeaderboardService();

export const getTopUsersWithPostsAndComments = asyncHandler(
  async (req: Request, res: Response) => {
    const result = await leaderboardService.getTopUsersWithPostsAndComments();
    res.status(200).json({
      status: "success",
      message: "Top users with most posts fetched successfully",
      data: { result },
    });
  },
);
