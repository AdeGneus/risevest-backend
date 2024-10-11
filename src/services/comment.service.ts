import Redis from "ioredis";
import AppDataSource from "../datasource";
import { Comment } from "../entities/comment.entity";
import { Post } from "../entities/post.entity";
import { NotFoundError } from "../exceptions/notFoundError";

export class CommentService {
  constructor(private readonly redisClient: Redis) {}

  public async addCommentToPost(
    postId: string,
    content: string,
  ): Promise<Comment> {
    const post = await AppDataSource.getRepository(Post).findOne({
      where: { id: postId },
    });
    if (!post) {
      throw new NotFoundError("Post not found");
    }

    const comment = new Comment();
    comment.content = content;
    comment.post = post;

    const savedComment =
      await AppDataSource.getRepository(Comment).save(comment);

    await this.redisClient.del(`post_comments:${postId}`);

    return savedComment;
  }
}
