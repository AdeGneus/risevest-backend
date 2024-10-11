import Redis from "ioredis";
import { Repository } from "typeorm";
import AppDataSource from "../../src/datasource";
import { Comment } from "../../src/entities/comment.entity";
import { Post } from "../../src/entities/post.entity";
import { NotFoundError } from "../../src/exceptions/notFoundError";
import { CommentService } from "../../src/services/comment.service";

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
    del: jest.fn(),
  }));
});

describe("CommentService", () => {
  let commentService: CommentService;
  let mockPostRepository: Partial<Repository<Post>>;
  let mockCommentRepository: Partial<Repository<Comment>>;
  let mockRedisClient: jest.Mocked<Redis>;

  beforeEach(() => {
    mockPostRepository = {
      findOne: jest.fn(),
    };
    mockCommentRepository = {
      save: jest.fn(),
    };
    (AppDataSource.getRepository as jest.Mock).mockImplementation((entity) => {
      if (entity === Post) return mockPostRepository;
      if (entity === Comment) return mockCommentRepository;
    });
    mockRedisClient = new Redis() as jest.Mocked<Redis>;
    commentService = new CommentService(mockRedisClient);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should add a comment to a post and invalidate cache", async () => {
    const post = { id: "1", content: "This is a post" };
    const comment = { id: "1", content: "This is a comment", post };

    (mockPostRepository.findOne as jest.Mock).mockResolvedValueOnce(post);
    (mockCommentRepository.save as jest.Mock).mockResolvedValueOnce(comment);

    const result = await commentService.addCommentToPost(
      "1",
      "This is a comment",
    );

    expect(result).toEqual(comment);
    expect(mockCommentRepository.save).toHaveBeenCalledWith(
      expect.objectContaining({ content: "This is a comment", post }),
    );
    expect(mockRedisClient.del).toHaveBeenCalledWith("post_comments:1");
  });

  it("should throw NotFoundError if post is not found", async () => {
    (mockPostRepository.findOne as jest.Mock).mockResolvedValueOnce(null);

    await expect(
      commentService.addCommentToPost("1", "This is a comment"),
    ).rejects.toThrow(NotFoundError);
  });
});
