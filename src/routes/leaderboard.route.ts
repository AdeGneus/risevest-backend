import { Router } from "express";
import { getTopUsersWithPostsAndComments } from "../controllers/leaderboard.controller";
import { deserializeUser } from "../middlewares/deserializeUser";

const leaderboardRouter = Router();

leaderboardRouter.get(
  "/top-users",
  deserializeUser,
  getTopUsersWithPostsAndComments,
);

export default leaderboardRouter;
