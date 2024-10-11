import { Request, Response } from "express";
import Redis from "ioredis";
import asyncHandler from "../middlewares/asyncHandler";
import { PostService } from "../services/post.service";

const redisClient = new Redis();
const postService = new PostService(redisClient);

export const createPost = asyncHandler(async (req: Request, res: Response) => {
  const { content } = req.body;
  const post = await postService.createPost(req.user.id, content);
  res.status(201).json({
    status: "success",
    message: "Post created successfully",
    data: { post },
  });
});
