import pool from './pool'

export interface ICity {
  id: string
  name: string
}

const TABLE_NAME = 'cities'

export default {
  async get(id: string): Promise<ICity> {
    const {
      rows: [row],
    } = await pool.query<ICity>(`SELECT * FROM ${TABLE_NAME} WHERE id = $1`, [
      id,
    ])
    return row && { ...row, id: String(row.id) }
  },
  async getAll(): Promise<ICity[]> {
    const { rows } = await pool.query<ICity>(
      `SELECT * FROM ${TABLE_NAME} ORDER BY name`,
    )
    return rows.map(row => ({ ...row, id: String(row.id) }))
  },
}
