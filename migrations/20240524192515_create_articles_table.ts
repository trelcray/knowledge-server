import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable("articles", (table) => {
    table.increments("id").primary();
    table.string("name").notNullable();
    table.string("description", 1000).notNullable();
    table.integer("imageUrl", 1000);
    table.binary("content").notNullable();
    table.integer("userId").references("id").inTable("users").notNullable();
    table
      .integer("categoryId")
      .references("id")
      .inTable("categories")
      .notNullable();
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable("articles");
}
