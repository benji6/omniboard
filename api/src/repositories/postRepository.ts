import pool from './pool'

export interface IPost {
  body: string
  id: number
  location: string
  tags: string[]
  title: string
  userId: string
}

export default {
  async list(): Promise<IPost[]> {
    const result = await pool.query(
      'SELECT body, id, location, tags, title, user_id AS "userId" FROM posts',
    )
    return result.rows || []
  },
  async create(post: Omit<IPost, 'id'>): Promise<IPost> {
    const result = await pool.query(
      'INSERT INTO posts (body, location, tags, title, user_id) VALUES ($1, $2, $3, $4, $5) RETURNING body, id, location, tags, title, user_id AS "userId"',
      [post.body, post.location, post.tags, post.title, post.userId],
    )
    return result.rows && result.rows[0]
  },
  async find({ title }: { title: string }): Promise<IPost[]> {
    const result = await pool.query(
      'SELECT body, id, location, tags, title, user_id AS "userId" FROM posts WHERE title ILIKE $1',
      [`%${title}%`],
    )
    return result.rows || []
  },
  async getById(id: number): Promise<IPost | undefined> {
    const result = await pool.query(
      'SELECT body, id, location, tags, title, user_id AS "userId" FROM posts WHERE id = $1',
      [id],
    )
    return result.rows && result.rows[0]
  },
}
