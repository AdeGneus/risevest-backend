import { Router } from "express";
import authRouter from "./auth.route";
import commentRouter from "./comment.route";
import postRouter from "./post.route";
import userRouter from "./user.route";

const router = Router();

router.use("/auth", authRouter);
router.use("/users", userRouter);
router.use("/users/:id/posts", postRouter);
router.use("/posts/:postId/comments", commentRouter);

export default router;
