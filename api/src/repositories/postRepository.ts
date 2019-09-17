import pool from './pool'

export interface IPost {
  body: string
  id: number
  location: string
  tags: string[]
  title: string
  userId: string
}

const COLUMNS = 'body, id, location, tags, title, user_id AS "userId"'
const TABLE_NAME = 'posts'

export default {
  async create(post: Omit<IPost, 'id'>): Promise<IPost> {
    const result = await pool.query(
      `INSERT INTO ${TABLE_NAME} (body, location, tags, title, user_id) VALUES ($1, $2, $3, $4, $5) RETURNING ${COLUMNS}`,
      [post.body, post.location, post.tags, post.title, post.userId],
    )
    return result.rows && result.rows[0]
  },
  async search({
    body,
    title,
  }: {
    body?: string
    title?: string
  }): Promise<IPost[]> {
    let result
    if (!title && !body)
      result = await pool.query(`SELECT ${COLUMNS} FROM ${TABLE_NAME}`)
    else {
      if (!body)
        result = await pool.query(
          `SELECT ${COLUMNS} FROM ${TABLE_NAME} WHERE title ILIKE $1`,
          [`%${title}%`],
        )
      else if (!title)
        result = await pool.query(
          `SELECT ${COLUMNS} FROM ${TABLE_NAME} WHERE body ILIKE $1`,
          [`%${body}%`],
        )
      else
        result = await pool.query(
          `SELECT ${COLUMNS} FROM ${TABLE_NAME} WHERE body ILIKE $1 AND title ILIKE $2`,
          [`%${body}%`, `%${title}%`],
        )
    }

    return result.rows || []
  },
  async getById(id: number): Promise<IPost | undefined> {
    const result = await pool.query(
      `SELECT ${COLUMNS} FROM ${TABLE_NAME} WHERE id = $1`,
      [id],
    )
    return result.rows && result.rows[0]
  },
}
