import pool from './pool'

export interface IPost {
  body: string
  id: number
  location: string
  title: string
  userId: string
}

const COLUMNS = 'body, id, location, title, user_id AS "userId"'
const TABLE_NAME = 'posts'
const ORDER_BY = 'ORDER BY id DESC'

export default {
  async create(post: Omit<IPost, 'id'>): Promise<IPost> {
    const result = await pool.query(
      `INSERT INTO ${TABLE_NAME} (body, location, title, user_id) VALUES ($1, $2, $3, $4) RETURNING ${COLUMNS}`,
      [post.body, post.location, post.title, post.userId],
    )
    return result.rows && result.rows[0]
  },
  async getById(id: number): Promise<IPost | undefined> {
    const result = await pool.query(
      `SELECT ${COLUMNS} FROM ${TABLE_NAME} WHERE id = $1`,
      [id],
    )
    return result.rows && result.rows[0]
  },
  async getByUserId(userId: string): Promise<IPost[]> {
    const result = await pool.query(
      `SELECT ${COLUMNS} FROM ${TABLE_NAME} WHERE user_id = $1 ${ORDER_BY}`,
      [userId],
    )
    return result.rows || []
  },
  async search({
    body,
    location,
    title,
  }: {
    body?: string
    location?: string
    title?: string
  }): Promise<IPost[]> {
    let result
    if (!body && !location && !title)
      result = await pool.query(
        `SELECT ${COLUMNS} FROM ${TABLE_NAME} ${ORDER_BY}`,
      )
    else {
      let whereClause = 'WHERE'
      let queryArgs = []
      if (body) {
        whereClause += ` body ILIKE $${queryArgs.length + 1}`
        queryArgs.push(`%${body}%`)
      }
      if (location) {
        whereClause += ` ${
          queryArgs.length ? 'AND ' : ''
        }location ILIKE $${queryArgs.length + 1}`
        queryArgs.push(`%${location}%`)
      }
      if (title) {
        whereClause += ` ${
          queryArgs.length ? 'AND ' : ''
        }title ILIKE $${queryArgs.length + 1}`
        queryArgs.push(`%${title}%`)
      }
      result = await pool.query(
        `SELECT ${COLUMNS} FROM ${TABLE_NAME} ${whereClause} ${ORDER_BY}`,
        queryArgs,
      )
    }
    return result.rows || []
  },
  async update(post: IPost): Promise<IPost> {
    const result = await pool.query(
      `UPDATE ${TABLE_NAME} SET (body, location, title, user_id) = ($1, $2, $3, $4) WHERE id = $5 RETURNING ${COLUMNS}`,
      [post.body, post.location, post.title, post.userId, post.id],
    )
    return result.rows && result.rows[0]
  },
}
