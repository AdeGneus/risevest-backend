import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1728694229826 implements MigrationInterface {
  name = "Migration1728694229826";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "extended_base_entity" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, CONSTRAINT "PK_591f16ec58296b38634616ee560" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "comment_tbl" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "content" character varying NOT NULL, "postId" uuid NOT NULL, CONSTRAINT "PK_72dab105ae6c64135f6075753a4" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "post_tbl" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "content" character varying NOT NULL, "userId" uuid NOT NULL, CONSTRAINT "PK_101418e6f8e6924e2cdf7a112a1" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "user_tbl" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "first_name" character varying NOT NULL, "last_name" character varying NOT NULL, "email" character varying NOT NULL, "password" character varying NOT NULL, CONSTRAINT "UQ_d6de080ec10320e718b40d53db7" UNIQUE ("email"), CONSTRAINT "PK_4f83c994072a8c4774158868464" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "comment_tbl" ADD CONSTRAINT "FK_e4db256ab8d8ebcdcb83b1dcc0d" FOREIGN KEY ("postId") REFERENCES "post_tbl"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "post_tbl" ADD CONSTRAINT "FK_e9a0ffcb43e05440cd4571b7c29" FOREIGN KEY ("userId") REFERENCES "user_tbl"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "post_tbl" DROP CONSTRAINT "FK_e9a0ffcb43e05440cd4571b7c29"`,
    );
    await queryRunner.query(
      `ALTER TABLE "comment_tbl" DROP CONSTRAINT "FK_e4db256ab8d8ebcdcb83b1dcc0d"`,
    );
    await queryRunner.query(`DROP TABLE "user_tbl"`);
    await queryRunner.query(`DROP TABLE "post_tbl"`);
    await queryRunner.query(`DROP TABLE "comment_tbl"`);
    await queryRunner.query(`DROP TABLE "extended_base_entity"`);
  }
}
