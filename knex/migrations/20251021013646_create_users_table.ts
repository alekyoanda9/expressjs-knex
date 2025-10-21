import type { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    return knex.schema.createTable('users', (table) => {
        table.string('username', 100).primary();
        table.string('password', 100).notNullable();
        table.string('name', 100).notNullable();
        table.string('token', 512).nullable()
    });
}


export async function down(knex: Knex): Promise<void> {
    return knex.schema.dropTableIfExists('users');
}

