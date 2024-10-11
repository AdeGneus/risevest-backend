import { Router } from "express";
import { createPost, getPostsByUserId } from "../controllers/post.controller";
import { deserializeUser } from "../middlewares/deserializeUser";
import { validateData } from "../middlewares/validateData";
import { postSchema } from "../schemas/post";

const postRouter = Router({ mergeParams: true });

postRouter.use(deserializeUser);

postRouter.post("/", validateData(postSchema), createPost);
postRouter.get("/", getPostsByUserId);

export default postRouter;
