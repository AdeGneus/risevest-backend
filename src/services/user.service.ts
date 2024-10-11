import Redis from "ioredis";
import AppDataSource from "../datasource";
import { User } from "../entities/user.entity";
import { NotFoundError } from "../exceptions/notFoundError";

export class UserService {
  private redisClient: Redis;

  constructor(redisClient?: Redis) {
    this.redisClient = redisClient || new Redis();
  }

  public async getAllUsers(): Promise<User[]> {
    const cacheKey = "all_users";
    const cachedUsers = await this.redisClient.get(cacheKey);

    if (cachedUsers) {
      return JSON.parse(cachedUsers);
    }

    const users = await AppDataSource.getRepository(User).find({
      select: ["id", "first_name", "last_name", "email"],
    });

    await this.redisClient.set(cacheKey, JSON.stringify(users), "EX", 3600);
    return users;
  }

  public async getUserById(id: string): Promise<User> {
    const cacheKey = `user_${id}`;
    const cachedUser = await this.redisClient.get(cacheKey);

    if (cachedUser) {
      return JSON.parse(cachedUser);
    }

    const user = await AppDataSource.getRepository(User).findOne({
      where: { id },
      select: ["id", "first_name", "last_name", "email"],
    });

    if (!user) {
      throw new NotFoundError("User not found");
    }

    await this.redisClient.set(cacheKey, JSON.stringify(user), "EX", 3600);
    return user;
  }
}
