import pool from './pool'
import { QueryResult } from 'pg'

interface IPostRow {
  body: string
  id: number
  location: string
  title: string
  userId: string
}

export interface IPost {
  body: string
  id: string
  location: string
  title: string
  userId: string
}

const COLUMNS = 'body, id, location, title, user_id AS "userId"'
const TABLE_NAME = 'posts'
const ORDER_BY = 'ORDER BY id DESC'

const resultToPost = ({ rows: [row] }: QueryResult<IPostRow>): IPost =>
  row && { ...row, id: String(row.id) }

const resultToPosts = ({ rows }: QueryResult<IPostRow>): IPost[] =>
  rows.map(row => ({ ...row, id: String(row.id) }))

export default {
  async create(post: Omit<IPost, 'id'>): Promise<IPost> {
    const result = await pool.query<any>(
      `INSERT INTO ${TABLE_NAME} (body, location, title, user_id) VALUES ($1, $2, $3, $4) RETURNING ${COLUMNS}`,
      [post.body, post.location, post.title, post.userId],
    )
    return resultToPost(result)
  },
  async delete(id: string): Promise<IPost> {
    const result = await pool.query<IPostRow>(
      `DELETE FROM ${TABLE_NAME} WHERE id = $1 RETURNING ${COLUMNS}`,
      [id],
    )
    return resultToPost(result)
  },
  async get(id: string): Promise<IPost | undefined> {
    const result = await pool.query<IPostRow>(
      `SELECT ${COLUMNS} FROM ${TABLE_NAME} WHERE id = $1`,
      [id],
    )
    return resultToPost(result)
  },
  async getByUserId(userId: string): Promise<IPost[]> {
    const result = await pool.query<IPostRow>(
      `SELECT ${COLUMNS} FROM ${TABLE_NAME} WHERE user_id = $1 ${ORDER_BY}`,
      [userId],
    )
    return resultToPosts(result)
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
      result = await pool.query<IPostRow>(
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
      result = await pool.query<IPostRow>(
        `SELECT ${COLUMNS} FROM ${TABLE_NAME} ${whereClause} ${ORDER_BY}`,
        queryArgs,
      )
    }
    return resultToPosts(result)
  },
  async update(post: IPost): Promise<IPost> {
    const result = await pool.query<IPostRow>(
      `UPDATE ${TABLE_NAME} SET (body, location, title, user_id) = ($1, $2, $3, $4) WHERE id = $5 RETURNING ${COLUMNS}`,
      [post.body, post.location, post.title, post.userId, post.id],
    )
    return resultToPost(result)
  },
}
