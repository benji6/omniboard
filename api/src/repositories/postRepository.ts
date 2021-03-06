import pool from './pool'
import { QueryResult } from 'pg'

export interface IPost {
  body: string
  cityId: string
  createdAt: Date
  id: string
  title: string
  userId: string
}

export interface ISearchResult {
  posts: IPost[]
  totalCount: number
}

const ALL_COLUMNS =
  'body, city_id as "cityId", created_at AS "createdAt", id, title, user_id AS "userId"'
const SETTABLE_COLUMNS = 'body, city_id, title, user_id'
const TABLE_NAME = 'posts'
const ORDER_BY = 'ORDER BY id DESC'

const resultToPost = ({ rows: [row] }: QueryResult<IPost>): IPost =>
  row && { ...row, cityId: String(row.cityId), id: String(row.id) }

const resultToPosts = ({ rows }: QueryResult<IPost>): IPost[] =>
  rows.map(row => ({ ...row, cityId: String(row.cityId), id: String(row.id) }))

const totalCountResultToNumber = (
  totalCountResult: QueryResult<{ count: string }>,
): number => Number(totalCountResult.rows[0].count)

export default {
  async create(post: Omit<IPost, 'id'>): Promise<IPost> {
    const result = await pool.query<any>(
      `INSERT INTO ${TABLE_NAME} (${SETTABLE_COLUMNS}) VALUES ($1, $2, $3, $4) RETURNING ${ALL_COLUMNS}`,
      [post.body, post.cityId, post.title, post.userId],
    )
    return resultToPost(result)
  },
  async delete(id: string): Promise<IPost> {
    const result = await pool.query<IPost>(
      `DELETE FROM ${TABLE_NAME} WHERE id = $1 RETURNING ${ALL_COLUMNS}`,
      [id],
    )
    return resultToPost(result)
  },
  async get(id: string): Promise<IPost | undefined> {
    const result = await pool.query<IPost>(
      `SELECT ${ALL_COLUMNS} FROM ${TABLE_NAME} WHERE id = $1`,
      [id],
    )
    return resultToPost(result)
  },
  async getByUserId(userId: string): Promise<IPost[]> {
    const result = await pool.query<IPost>(
      `SELECT ${ALL_COLUMNS} FROM ${TABLE_NAME} WHERE user_id = $1 ${ORDER_BY}`,
      [userId],
    )
    return resultToPosts(result)
  },
  async search({
    body,
    cityId,
    limit = 100,
    offset = 0,
    title,
  }: {
    body?: string
    cityId?: string
    limit?: number
    offset?: number
    title?: string
  }): Promise<ISearchResult> {
    let postsResult
    let totalCountResult
    if (!body && !cityId && !title) {
      totalCountResult = await pool.query<{ count: string }>(
        `SELECT COUNT(*) FROM ${TABLE_NAME}`,
      )
      postsResult = await pool.query<IPost>(
        `SELECT ${ALL_COLUMNS} FROM ${TABLE_NAME} ${ORDER_BY} LIMIT $1 OFFSET $2`,
        [limit, offset],
      )
    } else {
      let whereClause = 'WHERE'
      let queryArgs = []
      if (body) {
        whereClause += ` body ILIKE $${queryArgs.length + 1}`
        queryArgs.push(`%${body}%`)
      }
      if (cityId) {
        whereClause += ` ${
          queryArgs.length ? 'AND ' : ''
        }city_id = $${queryArgs.length + 1}`
        queryArgs.push(cityId)
      }
      if (title) {
        whereClause += ` ${
          queryArgs.length ? 'AND ' : ''
        }title ILIKE $${queryArgs.length + 1}`
        queryArgs.push(`%${title}%`)
      }
      totalCountResult = await pool.query<{ count: string }>(
        `SELECT COUNT(*) FROM ${TABLE_NAME} ${whereClause}`,
        queryArgs,
      )
      queryArgs.push(limit, offset)
      postsResult = await pool.query<IPost>(
        `SELECT ${ALL_COLUMNS} FROM ${TABLE_NAME} ${whereClause} ${ORDER_BY} LIMIT $${queryArgs.length -
          1} OFFSET $${queryArgs.length}`,
        queryArgs,
      )
    }
    return {
      posts: resultToPosts(postsResult),
      totalCount: totalCountResultToNumber(totalCountResult),
    }
  },
  async update(post: IPost): Promise<IPost> {
    const result = await pool.query<IPost>(
      `UPDATE ${TABLE_NAME} SET (${SETTABLE_COLUMNS}) = ($1, $2, $3, $4) WHERE id = $5 RETURNING ${ALL_COLUMNS}`,
      [post.body, post.cityId, post.title, post.userId, post.id],
    )
    return resultToPost(result)
  },
}
