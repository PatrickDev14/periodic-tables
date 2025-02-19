
exports.up = function(knex) {
  return knex.schema.createTable("tables", (table) => {
    table.increments("table_id").primary().notNullable();
    table.string("table_name").notNullable();
    table.integer("capacity").unsigned().notNullable();
    table.integer("reservation_id").unsigned().defaultTo(null);
    table
      .foreign("reservation_id")
      .references("reservation_id")
      .inTable("reservations")
    table.timestamps(true, true);
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable("tables");
};
