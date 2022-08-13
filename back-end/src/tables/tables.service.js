const { table } = require("../db/connection");
const knex = require("../db/connection");

function create(table) {
  return knex("tables")
    .insert(table)
    .returning("*")
    .then((createdRecords) => createdRecords[0]);
}

function read(table_id) {
  return knex("tables")
    .select("*")
    .where({ table_id })
    .first();
}

function updateTable(table_id, reservation_id) {
  return knex("tables")
    .where({ table_id })
    .update({ reservation_id }, "*")
    .then((updatedTable) => updatedTable[0])
}

function finishedEating(table_id) {
  return knex("tables")
    .where({ table_id })
    .update("reservation_id", null, "*")
    .then((finishedTable) => finishedTable[0]);
}

function listTablesByName() {
  return knex("tables")
    .select("*")
    .orderBy("table_name");
}

module.exports = {
  create,
  read,
  updateTable,
  finishedEating,
  listTablesByName,
}