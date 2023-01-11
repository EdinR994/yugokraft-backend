require('dotenv').config({
  path: '../.env'
})

module.exports = {
  client: 'postgres',
  connection: {
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_DB
  },
  migrations: {
    tableName: 'migrations'
  }
}