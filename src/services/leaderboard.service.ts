import AppDataSource from "../datasource";

export class LeaderboardService {
  public async getTopUsersWithPostsAndComments() {
    const entityManager = AppDataSource.manager;
    const result = await entityManager.query(`
      WITH RankedPosts AS (
        SELECT
          user_tbl.id AS user_id,
          user_tbl.first_name,
          user_tbl.last_name,
          post_tbl.id AS post_id,
          post_tbl.content AS post_content,
          comment_tbl.id AS comment_id,
          comment_tbl.content AS comment_content,
          comment_tbl.created_at,
          ROW_NUMBER() OVER (PARTITION BY user_tbl.id ORDER BY comment_tbl.created_at DESC) AS comment_rank
        FROM
          user_tbl
        LEFT JOIN post_tbl ON user_tbl.id = post_tbl."userId"
        LEFT JOIN comment_tbl ON post_tbl.id = comment_tbl."postId"
      ),
      UserPostCounts AS (
        SELECT
          user_tbl.id AS user_id,
          COUNT(post_tbl.id) AS post_count
        FROM
          user_tbl
        LEFT JOIN post_tbl ON user_tbl.id = post_tbl."userId"
        GROUP BY
          user_tbl.id
      )
      SELECT
        rp.user_id,
        rp.first_name,
        rp.last_name,
        rp.post_content,
        rp.comment_content
      FROM
        RankedPosts rp
      JOIN UserPostCounts upc ON rp.user_id = upc.user_id
      WHERE
        rp.comment_rank = 1
      ORDER BY
        upc.post_count DESC
      LIMIT 3;
    `);
    return result;
  }
}
