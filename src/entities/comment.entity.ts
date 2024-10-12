import { IsString } from "class-validator";
import { Column, Entity, ManyToOne } from "typeorm";
import ExtendedBaseEntity from "./base.entity";
import { Post } from "./post.entity";

@Entity({ name: "comment_tbl" })
class Comment extends ExtendedBaseEntity {
  @Column({ nullable: false })
  @IsString()
  content: string;

  @ManyToOne(() => Post, (post) => post.comments, { nullable: false })
  post: Post;
}

export { Comment };
