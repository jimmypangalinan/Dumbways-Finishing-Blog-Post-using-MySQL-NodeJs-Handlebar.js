// const { Pool } = require('pg/lib')

//import postgares pool
const { Pool } = require('pg')

const dbPool = new Pool({
    database: 'personal_web',
    port: 5432,
    user: 'postgres',
    password: 'admin'
})

//export agar bisa di panggil di index.js
module.exports = dbPool