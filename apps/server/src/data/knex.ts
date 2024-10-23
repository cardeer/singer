import Knex from "knex";

export const knex = Knex({
  client: process.env.DATABASE_DRIVER,
  connection: {
    host: process.env.MYSQL_HOST,
    port: parseInt(process.env.MYSQL_PORT as string),
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
  },
});
