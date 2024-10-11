import { IsString } from "class-validator";
import { Column, Entity, ManyToOne, OneToMany } from "typeorm";
import ExtendedBaseEntity from "./base.entity";
import { Comment } from "./comment.entity";
import { User } from "./user.entity";

@Entity({ name: "post_tbl" })
class Post extends ExtendedBaseEntity {
  @Column({ nullable: false })
  @IsString()
  content: string;

  @ManyToOne(() => User, (user) => user.posts, { nullable: false })
  user: User;

  @OneToMany(() => Comment, (comment) => comment.post)
  comments: Comment[];
}

export { Post };
