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

async function updateTableSeating(table_id, reservation_id) {
  const trx = await knex.transaction();
  return trx("tables")
    .where({ table_id })
    .update({ reservation_id }, "*")
    .then((updatedRecords) => updatedRecords[0])
    .then(() => 
      trx("reservations")
        .where({ reservation_id })
        .update({ status: "seated" })
      )
    .then(trx.commit)
    .catch(trx.rollback);
}

async function finishedEating(table_id, reservation_id) {
  const trx = await knex.transaction();
  return trx("tables")
    .where({ table_id })
    .update("reservation_id", null, "*")
    .then((finishedTable) => finishedTable[0])
    .then(() =>
      trx("reservations")
        .where({ reservation_id })
        .update({ status: "finished"})
      )
    .then(trx.commit)
    .catch(trx.rollback);
}

function listTablesByName() {
  return knex("tables")
    .select("*")
    .orderBy("table_name");
}

module.exports = {
  create,
  read,
  updateTableSeating,
  finishedEating,
  listTablesByName,
}