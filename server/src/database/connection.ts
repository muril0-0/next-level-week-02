import knex from "knex";
import path from "path";

//migrations: cotrolam a versão do banco de dados, é um git de banco de dados

const db = knex({
  client: "sqlite3",
  connection: {
    filename: path.resolve(__dirname, "database.sqlite"),
  },
  useNullAsDefault: true,
});

export default db;
