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

export const getPostsByUserId = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const posts = await postService.getPostsByUserId(id, req.user.id);
    res.status(200).json({
      status: "success",
      message: "Post fetched successfully",
      data: { posts },
    });
  },
);
