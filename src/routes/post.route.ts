import { Router } from "express";
import { createPost } from "../controllers/post.controller";
import { deserializeUser } from "../middlewares/deserializeUser";
import { validateData } from "../middlewares/validateData";
import { postSchema } from "../schemas/post";

const postRouter = Router();

postRouter.use(deserializeUser);

postRouter.post("/", validateData(postSchema), createPost);

export default postRouter;
