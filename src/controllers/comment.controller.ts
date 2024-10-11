import { Request, Response } from "express";
import Redis from "ioredis";
import asyncHandler from "../middlewares/asyncHandler";
import { CommentService } from "../services/comment.service";

const redisClient = new Redis();
const commentService = new CommentService(redisClient);

export const addCommentToPost = asyncHandler(
  async (req: Request, res: Response) => {
    const { postId } = req.params;
    const { content } = req.body;
    const comment = await commentService.addCommentToPost(postId, content);
    res.status(201).json({
      status: "success",
      message: "Comment added successfully",
      data: { comment },
    });
  },
);
