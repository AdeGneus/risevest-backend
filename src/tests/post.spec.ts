import Redis from "ioredis";
import { Repository } from "typeorm";
import AppDataSource from "../../src/datasource";
import { Post } from "../../src/entities/post.entity";
import { User } from "../../src/entities/user.entity";
import { NotFoundError } from "../../src/exceptions/notFoundError";
import { PostService } from "../../src/services/post.service";

jest.mock("../../src/datasource", () => ({
  __esModule: true,
  default: {
    getRepository: jest.fn(),
  },
}));

jest.mock("ioredis", () => {
  return jest.fn().mockImplementation(() => ({
    get: jest.fn(),
    set: jest.fn(),
  }));
});

describe("PostService", () => {
  let postService: PostService;
  let mockUserRepository: Partial<Repository<User>>;
  let mockPostRepository: Partial<Repository<Post>>;
  let mockRedisClient: jest.Mocked<Redis>;

  beforeEach(() => {
    mockUserRepository = {
      findOne: jest.fn(),
    };
    mockPostRepository = {
      save: jest.fn(),
      find: jest.fn(),
      remove: jest.fn(),
    };
    (AppDataSource.getRepository as jest.Mock).mockImplementation((entity) => {
      if (entity === User) return mockUserRepository;
      if (entity === Post) return mockPostRepository;
    });
    mockRedisClient = new Redis() as jest.Mocked<Redis>;
    postService = new PostService(mockRedisClient);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should create a post for a user and update cache", async () => {
    const user = {
      id: "1",
      first_name: "John",
      last_name: "Doe",
      email: "john.doe@example.com",
    };
    const post = { id: "1", content: "This is a post", user };
    const cachedPosts = [{ id: "2", content: "Old cached post", user }];

    (mockUserRepository.findOne as jest.Mock).mockResolvedValueOnce(user);
    (mockPostRepository.save as jest.Mock).mockResolvedValueOnce(post);
    mockRedisClient.get.mockResolvedValueOnce(JSON.stringify(cachedPosts));

    const result = await postService.createPost("1", "This is a post");

    expect(result).toEqual(post);
    expect(mockPostRepository.save).toHaveBeenCalledWith(
      expect.objectContaining({ content: "This is a post", user }),
    );
    expect(mockRedisClient.set).toHaveBeenCalledWith(
      "user_posts:1",
      JSON.stringify([...cachedPosts, post]),
      "EX",
      3600,
    );
  });

  it("should throw NotFoundError if user is not found when creating a post", async () => {
    (mockUserRepository.findOne as jest.Mock).mockResolvedValueOnce(null);

    await expect(postService.createPost("1", "This is a post")).rejects.toThrow(
      NotFoundError,
    );
  });
});
