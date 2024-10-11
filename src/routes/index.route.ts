import { Router } from "express";
import authRouter from "./auth.route";
import postRouter from "./post.route";
import userRouter from "./user.route";

const router = Router();

router.use("/auth", authRouter);
router.use("/users", userRouter);
router.use("/users/:id/posts", postRouter);

export default router;
