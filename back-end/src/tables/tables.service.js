const { table } = require("../db/connection");
const knex = require("../db/connection");

function create(table) {
  return knex("tables")
    .insert(table)
    .returning("*")
    .then((createdRecords) => createdRecords[0]);
}

function listTablesByName() {
  return knex("tables")
    .select("*")
    .orderBy("table_name");
}

module.exports = {
  create,
  listTablesByName,
}