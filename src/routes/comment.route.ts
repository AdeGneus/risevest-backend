import { Router } from "express";
import { addCommentToPost } from "../controllers/comment.controller";
import { deserializeUser } from "../middlewares/deserializeUser";
import { validateData } from "../middlewares/validateData";
import { commentSchema } from "../schemas/comment";

const commentRouter = Router({ mergeParams: true });

commentRouter.post(
  "/",
  deserializeUser,
  validateData(commentSchema),
  addCommentToPost,
);

export default commentRouter;
