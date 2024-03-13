const { Pool } = require('pg')

const pool = new Pool({
    user: 'postgres',
    password: 'zaleska001',
    host: 'localhost',
    port: 5432,
    database: ''
})

module.exports = {
    query: (text, params) => pool.query(text, params),
}