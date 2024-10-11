import Redis from "ioredis";
import { Repository } from "typeorm";
import AppDataSource from "../datasource";
import { User } from "../entities/user.entity";
import { UserService } from "../services/user.service";

jest.mock("ioredis");
jest.mock("../../src/datasource", () => ({
  __esModule: true,
  default: {
    getRepository: jest.fn(),
  },
}));

describe("UserService", () => {
  let userService: UserService;
  let mockUserRepository: Partial<Repository<User>>;
  let mockRedisClient: jest.Mocked<Redis>;

  beforeEach(() => {
    mockUserRepository = {
      find: jest.fn(),
      findOne: jest.fn(),
    };
    (AppDataSource.getRepository as jest.Mock).mockReturnValue(
      mockUserRepository,
    );
    mockRedisClient = new Redis() as jest.Mocked<Redis>;
    userService = new UserService(mockRedisClient);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should get all users and cache the result", async () => {
    const users = [
      {
        id: "1",
        first_name: "John",
        last_name: "Doe",
        email: "john.doe@example.com",
      },
    ];
    mockUserRepository.find = jest.fn().mockResolvedValueOnce(users);
    mockRedisClient.get = jest.fn().mockResolvedValueOnce(null);
    mockRedisClient.set = jest.fn().mockResolvedValueOnce("OK");

    const result = await userService.getAllUsers();

    expect(result).toEqual(users);
    expect(mockRedisClient.set).toHaveBeenCalledWith(
      "all_users",
      JSON.stringify(result),
      "EX",
      3600,
    );
  });
});
