import argon from "argon2";
import { Repository } from "typeorm";
import AppDataSource from "../../src/datasource";
import { User } from "../../src/entities/user.entity";
import { ConflictError } from "../../src/exceptions/conflictError";
import { AuthService } from "../../src/services/auth.service";
import { UnauthorizedError } from "../exceptions/unauthorizedError";

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

describe("AuthService - loginUser", () => {
  let authService: AuthService;
  let mockUserRepository: Partial<Repository<User>>;

  beforeEach(() => {
    mockUserRepository = {
      findOne: jest.fn(),
    };
    (AppDataSource.getRepository as jest.Mock).mockReturnValue(
      mockUserRepository,
    );
    authService = new AuthService();
  });

  it("should login a user successfully", async () => {
    (mockUserRepository.findOne as jest.Mock).mockResolvedValueOnce({
      id: "test-id",
      first_name: "John",
      last_name: "Doe",
      email: "john.doe@example.com",
      password: "hashedPassword",
      isCorrectPassword: jest.fn().mockResolvedValueOnce(true),
    } as unknown as User);

    const result = await authService.loginUser({
      email: "john.doe@example.com",
      password: "password123",
    });

    expect(result.user.email).toBe("john.doe@example.com");
    expect(result.message).toBe("Login successful");
  });

  it("should throw UnauthorizedError if email or password is incorrect", async () => {
    (mockUserRepository.findOne as jest.Mock).mockResolvedValueOnce(null);

    await expect(
      authService.loginUser({
        email: "john.doe@example.com",
        password: "wrongpassword",
      }),
    ).rejects.toThrow(UnauthorizedError);

    (mockUserRepository.findOne as jest.Mock).mockResolvedValueOnce({
      id: "test-id",
      email: "john.doe@example.com",
      password: "hashedPassword",
      isCorrectPassword: jest.fn().mockResolvedValueOnce(false),
    } as unknown as User);

    await expect(
      authService.loginUser({
        email: "john.doe@example.com",
        password: "wrongpassword",
      }),
    ).rejects.toThrow(UnauthorizedError);
  });

  it("should throw validation error for invalid login data", async () => {
    const invalidLoginData = {
      email: "not-an-email",
      password: "short",
    };

    await expect(authService.loginUser(invalidLoginData)).rejects.toThrow(
      Error,
    );
  });
});
