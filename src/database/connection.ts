import { createPool } from 'mysql2/promise'

const pool = createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_STORE,
    port: parseInt(process.env.DB_PORT || '3000'),
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
})

export default pool