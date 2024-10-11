import Redis from "ioredis";
import AppDataSource from "../datasource";
import { User } from "../entities/user.entity";

const redisClient = new Redis();

export class UserService {
  public async getAllUsers(): Promise<User[]> {
    const cacheKey = "all_users";
    const cachedUsers = await redisClient.get(cacheKey);

    if (cachedUsers) {
      return JSON.parse(cachedUsers);
    }

    const users = await AppDataSource.getRepository(User).find({
      select: ["id", "first_name", "last_name", "email"],
    });

    await redisClient.set(cacheKey, JSON.stringify(users), "EX", 3600);
    return users;
  }
}
