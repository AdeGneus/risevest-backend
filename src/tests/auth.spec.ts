import argon from "argon2";
import { Repository } from "typeorm";
import AppDataSource from "../../src/datasource";
import { User } from "../../src/entities/user.entity";
import { ConflictError } from "../../src/exceptions/conflictError";
import { AuthService } from "../../src/services/auth.service";

jest.mock("argon2");
jest.mock("../../src/datasource");

describe("AuthService - createUser", () => {
  let authService: AuthService;
  let mockUserRepository: Partial<Repository<User>>;

  beforeEach(() => {
    mockUserRepository = {
      findOne: jest.fn(),
      save: jest.fn(),
    };
    (AppDataSource.getRepository as jest.Mock).mockReturnValue(
      mockUserRepository,
    );
    authService = new AuthService();
  });

  it("should create a new user successfully", async () => {
    (mockUserRepository.findOne as jest.Mock).mockResolvedValueOnce(null);
    (mockUserRepository.save as jest.Mock).mockResolvedValueOnce({
      id: "test-id",
      first_name: "John",
      last_name: "Doe",
      email: "john.doe@example.com",
    });

    (argon.hash as jest.Mock).mockResolvedValueOnce("hashedPassword");

    const result = await authService.createUser({
      first_name: "John",
      last_name: "Doe",
      email: "john.doe@example.com",
      password: "password123",
    });

    expect(result.user.first_name).toBe("John");
    expect(result.user.email).toBe("john.doe@example.com");
    expect(argon.hash).toHaveBeenCalledWith("password123");
    expect(mockUserRepository.save).toHaveBeenCalled();
  });

  it("should throw ConflictError if user already exists", async () => {
    (mockUserRepository.findOne as jest.Mock).mockResolvedValueOnce({
      id: "existing-id",
      email: "john.doe@example.com",
    } as User);

    await expect(
      authService.createUser({
        first_name: "John",
        last_name: "Doe",
        email: "john.doe@example.com",
        password: "password123",
      }),
    ).rejects.toThrow(ConflictError);

    expect(mockUserRepository.findOne).toHaveBeenCalledWith({
      where: { email: "john.doe@example.com" },
    });
  });

  it("should throw validation error for invalid data", async () => {
    const invalidUserData = {
      first_name: "",
      last_name: "",
      email: "not-an-email",
      password: "short",
    };

    await expect(authService.createUser(invalidUserData)).rejects.toThrow(
      Error,
    );
  });
});
