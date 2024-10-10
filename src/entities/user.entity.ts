import argon from "argon2";
import { IsEmail, IsString } from "class-validator";
import { Column, Entity } from "typeorm";
import ExtendedBaseEntity from "./base.entity";

@Entity({ name: "user_tbl" })
class User extends ExtendedBaseEntity {
  @Column({ nullable: false })
  @IsString()
  first_name: string;

  @Column({ nullable: false })
  @IsString()
  last_name: string;

  @Column({ unique: true, nullable: false })
  @IsEmail()
  email: string;

  @Column({ nullable: false })
  @IsString()
  password: string;

  async isCorrectPassword(candidatePassword: string): Promise<boolean> {
    return argon.verify(this.password, candidatePassword);
  }
}

export { User };
