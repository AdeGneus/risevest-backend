import Redis from "ioredis";
import AppDataSource from "../datasource";
import { User } from "../entities/user.entity";

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
}
