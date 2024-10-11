import { IsString } from "class-validator";
import { Column, Entity, ManyToOne } from "typeorm";
import ExtendedBaseEntity from "./base.entity";
import { User } from "./user.entity";

@Entity({ name: "post_tbl" })
class Post extends ExtendedBaseEntity {
  @Column({ nullable: false })
  @IsString()
  content: string;

  @ManyToOne(() => User, (user) => user.posts, { nullable: false })
  user: User;
}

export { Post };
