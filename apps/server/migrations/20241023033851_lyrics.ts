import { type Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTableIfNotExists("lyrics", (table) => {
    table.string("id").notNullable().primary();
    table.text("lyrics");
    table.timestamps();
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists("lyrics");
}
