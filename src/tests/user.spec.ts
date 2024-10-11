import Redis from "ioredis";
import { Repository } from "typeorm";
import AppDataSource from "../datasource";
import { User } from "../entities/user.entity";
import { NotFoundError } from "../exceptions/notFoundError";
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

  it("should get a single user by ID and cache the result", async () => {
    const user = {
      id: "1",
      first_name: "John",
      last_name: "Doe",
      email: "john.doe@example.com",
    };
    mockUserRepository.findOne = jest.fn().mockResolvedValueOnce(user);
    mockRedisClient.get = jest.fn().mockResolvedValueOnce(null);
    mockRedisClient.set = jest.fn().mockResolvedValueOnce("OK");

    const result = await userService.getUserById("1");

    expect(result).toEqual(user);
    expect(mockRedisClient.set).toHaveBeenCalledWith(
      "user_1",
      JSON.stringify(result),
      "EX",
      3600,
    );
  });

  it("should throw NotFoundError if user is not found", async () => {
    mockUserRepository.findOne = jest.fn().mockResolvedValueOnce(null);
    mockRedisClient.get = jest.fn().mockResolvedValueOnce(null);

    await expect(userService.getUserById("1")).rejects.toThrow(NotFoundError);
  });
});
