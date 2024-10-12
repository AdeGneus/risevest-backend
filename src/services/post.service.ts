import Redis from "ioredis";
import AppDataSource from "../datasource";
import { Post } from "../entities/post.entity";
import { User } from "../entities/user.entity";
import { NotFoundError } from "../exceptions/notFoundError";

export class PostService {
  constructor(private readonly redisClient: Redis) {}

  public async createPost(userId: string, content: string): Promise<Post> {
    const user = await AppDataSource.getRepository(User).findOne({
      where: { id: userId },
      select: ["id", "first_name", "last_name"],
    });

    if (!user) {
      throw new NotFoundError("User not found");
    }

    const post = new Post();
    post.content = content;
    post.user = user;

    const savedPost = await AppDataSource.getRepository(Post).save(post);

    const cachedPosts = await this.redisClient.get(`user_posts:${userId}`);
    if (cachedPosts) {
      const posts = JSON.parse(cachedPosts);
      posts.push(savedPost);
      await this.redisClient.set(
        `user_posts:${userId}`,
        JSON.stringify(posts),
        "EX",
        3600,
      );
    }

    return savedPost;
  }

  public async getPostsByUserId(
    paramUserId: string,
    currentUserId: string,
  ): Promise<Post[]> {
    const userId = paramUserId === "me" ? currentUserId : paramUserId;

    const cachedPosts = await this.redisClient.get(`user_posts:${userId}`);
    if (cachedPosts) {
      return JSON.parse(cachedPosts);
    }

    const user = await AppDataSource.getRepository(User).findOne({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundError("User not found");
    }

    const posts = await AppDataSource.getRepository(Post).find({
      where: { user: { id: userId } },
    });

    await this.redisClient.set(
      `user_posts:${userId}`,
      JSON.stringify(posts),
      "EX",
      3600,
    );

    return posts;
  }
}
