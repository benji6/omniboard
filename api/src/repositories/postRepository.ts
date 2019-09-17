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
    location,
    title,
  }: {
    body?: string
    location?: string
    title?: string
  }): Promise<IPost[]> {
    let result
    if (!body && !location && !title)
      result = await pool.query(`SELECT ${COLUMNS} FROM ${TABLE_NAME}`)
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
        `SELECT ${COLUMNS} FROM ${TABLE_NAME} ${whereClause}`,
        queryArgs,
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
