const knex = require("../db/connection");

function create(reservation) {
  return knex("reservations")
    .insert(reservation)
    .returning("*")
    .then((createdRecords) => createdRecords[0]);
}

function read(reservation_id) {
  return knex("reservations")
    .select("*")
    .where({ reservation_id})
    .first();
}

function updateStatus(reservation_id, status) {
  return knex("reservations")
    .where({ reservation_id })
    .update({ status }, "*")
    .then((updatedRecords) => updatedRecords[0]);
}

function listByDate(reservation_date) {
  return knex("reservations")
    .select("*")
    .where({ reservation_date })
    .whereNot({ status: "finished" })
    .orderBy("reservation_time");
}

module.exports = {
  create,
  read,
  updateStatus,
  listByDate,
}