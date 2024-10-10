import argon from "argon2";
import AppDataSource from "../datasource";
import { User } from "../entities/user.entity";
import { ConflictError } from "../exceptions/conflictError";
import { IUserSignUpSchema } from "../schemas/user";

export class AuthService {
  public async createUser(
    payload: IUserSignUpSchema,
  ): Promise<{ user: Partial<User>; message: string }> {
    const { first_name, last_name, email, password } = payload;

    const existingUser = await AppDataSource.getRepository(User).findOne({
      where: { email },
    });

    if (existingUser) {
      throw new ConflictError("User already exists");
    }

    const hashedPassword = await argon.hash(password);

    const user = new User();
    user.first_name = first_name;
    user.last_name = last_name;
    user.email = email;
    user.password = hashedPassword;

    const newUser = await AppDataSource.getRepository(User).save(user);

    delete newUser.password;
    delete newUser.deleted_at;

    return { user: newUser, message: "User created successfully" };
  }
}
