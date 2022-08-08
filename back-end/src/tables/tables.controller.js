const service = require("./tables.service");
const hasProperties = require("../errors/hasProperties");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");

// ---- validating properties ---- //
const REQUIRED_PROPERTIES = [
  "table_name",
  "capacity",
];

const hasRequiredProperties = hasProperties(REQUIRED_PROPERTIES);

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

// ---- CRUD FUNCTIONS ---- //

async function create(req, res) {
  const table = await service.create(req.body.data);
  res.status(201).json({ data: table });
}

async function listTablesByName(req, res) {
  res.json({ data: await service.listTablesByName() });
}

module.exports = {
  create: [
    hasRequiredProperties,
    hasValidNameLength,
    hasValidCapacity,
    asyncErrorBoundary(create),
  ],
  list: asyncErrorBoundary(listTablesByName),
}