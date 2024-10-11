import AppDataSource from "../datasource";
import { LeaderboardService } from "../services/leaderboard.service";

jest.mock("../datasource", () => ({
  __esModule: true,
  default: {
    manager: {
      query: jest.fn(),
    },
  },
}));

describe("LeaderboardService", () => {
  let leaderboardService: LeaderboardService;

  beforeEach(() => {
    leaderboardService = new LeaderboardService();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should fetch the top 3 users with the most posts and their latest comment", async () => {
    const mockResult = [
      {
        user_id: "1",
        first_name: "John",
        last_name: "Doe",
        post_content: "This is a post",
        comment_content: "This is a comment",
      },
      {
        user_id: "2",
        first_name: "Jane",
        last_name: "Smith",
        post_content: "Another post",
        comment_content: "Another comment",
      },
      {
        user_id: "3",
        first_name: "Alice",
        last_name: "Johnson",
        post_content: "Yet another post",
        comment_content: "Yet another comment",
      },
    ];

    (AppDataSource.manager.query as jest.Mock).mockResolvedValueOnce(
      mockResult,
    );

    const result = await leaderboardService.getTopUsersWithPostsAndComments();

    expect(AppDataSource.manager.query).toHaveBeenCalledTimes(1);
    expect(result).toEqual(mockResult);
  });

  it("should return an empty array if no users are found", async () => {
    (AppDataSource.manager.query as jest.Mock).mockResolvedValueOnce([]);

    const result = await leaderboardService.getTopUsersWithPostsAndComments();

    expect(AppDataSource.manager.query).toHaveBeenCalledTimes(1);
    expect(result).toEqual([]);
  });
});
