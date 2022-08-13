const tablesService = require("./tables.service");
const hasProperties = require("../errors/hasProperties");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");
const reservationsService = require("../reservations/reservations.service");

// ---- validating properties ---- //
const REQUIRED_PROPERTIES = [
  "table_name",
  "capacity",
];

// ---- VALIDATION MIDDLEWARE ---- //

const hasRequiredProperties = hasProperties(REQUIRED_PROPERTIES);
const hasRequiredPropertiesToUpdate = hasProperties(["reservation_id"]);

async function tableExists(req, res, next) {
  const { table_id } = req.params;
  const table = await tablesService.read(table_id);

  if (table) {
    res.locals.table = table;
    return next();
  }
  next({
    status: 404,
    message: `The table ${table_id} cannot be found.`,
  });
}

async function reservationExists(req, res, next) {
  const { reservation_id } = req.body.data;
  const reservation = await reservationsService.read(reservation_id);

  if (reservation) {
    res.locals.reservation = reservation;
    return next();
  }
  next({
    status: 404,
    message: `The reservation "${reservation_id}" cannot be found.`,
  });
}

function tableIsEmpty(req, res, next) {
  const { reservation_id } = res.locals.table;
  if (!reservation_id) {
    return next();
  }
  next({
    status: 400,
    message: `The table is already occupied. Please choose another table.`
  });
}

function tableIsOccupied(req, res, next) {
  const { reservation_id } = res.locals.table;
  if (reservation_id) {
    return next();
  }
  next({
    status: 400,
    message: `The table is not occupied.`
  });
}

function hasValidNameLength(req, res, next) {
  const { table_name } = req.body.data;
  if (table_name.length >= 2) {
    return next();
  }
  next({
    status: 400,
    message: `The table_name must have a length of at least 2 characters.`
  });
}

function hasValidCapacity(req, res, next) {
  const { capacity } = req.body.data;
  if (Number.isInteger(capacity) && capacity >= 1) {
    return next();
  }
  next({
    status: 400,
    message: `The capacity must be 1 or more.`
  });
}

function hasSufficientSeats(req, res, next) {
  const { capacity } = res.locals.table;
  const { people } = res.locals.reservation;
  if (capacity >= people ) {
    return next();
  }
  next({
    status: 400,
    message: `The party size of ${people} exceeds the table capacity.`
  });
}

// ---- CRUD FUNCTIONS ---- //

async function create(req, res) {
  const table = await tablesService.create(req.body.data);
  res.status(201).json({ data: table });
}

function read(req, res) {
  const { table } = res.locals;
  res.status(200).json({ data: table });
}

async function updateReservationSeating(req, res) {
  const { table_id } = res.locals.table;
  const { reservation_id } = res.locals.reservation;
  updatedTable = await tablesService.updateTable(table_id, reservation_id);
  res.status(200).json({ data: updatedTable });
}

async function finishedEating(req, res) {
  const { table_id } = res.locals.table;
  const finishedTable = await tablesService.finishedEating(table_id);
  res.status(200).json({ data: finishedTable });
}

async function listTablesByName(req, res) {
  res.json({ data: await tablesService.listTablesByName() });
}

module.exports = {
  create: [
    hasRequiredProperties,
    hasValidNameLength,
    hasValidCapacity,
    asyncErrorBoundary(create),
  ],
  read: [
    asyncErrorBoundary(tableExists),
    read,
  ],
  updateReservationSeating: [
    hasRequiredPropertiesToUpdate,
    asyncErrorBoundary(tableExists),
    asyncErrorBoundary(reservationExists),
    tableIsEmpty,
    hasSufficientSeats,
    asyncErrorBoundary(updateReservationSeating),
  ],
  finishedEating: [
    asyncErrorBoundary(tableExists),
    tableIsOccupied,
    asyncErrorBoundary(finishedEating),
  ],
  list: asyncErrorBoundary(listTablesByName),
}