import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable("categories", (table) => {
    table.increments("id").primary();
    table.string("name").notNullable();
    table.integer("parentId").references("id").inTable("categories");
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable("categories");
}
