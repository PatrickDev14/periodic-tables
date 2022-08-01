const service = require("./reservations.service");
const hasProperties = require("../errors/hasProperties");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");

// ---- validating properties ---- //
const REQUIRED_PROPERTIES = [
  "first_name",
  "last_name",
  "mobile_number",
  "reservation_date",
  "reservation_time",
  "people",
];

const timeFormat = /[0-9]{2}:[0-9]{2}/;

// ---- VALIDATION MIDDLEWARE ---- //
const hasRequiredProperties = hasProperties(REQUIRED_PROPERTIES);

function hasValidDate(req, res, next) {
  const date = req.body.data.reservation_date;
  const valid = Date.parse(date);
  if (valid) {
    return next();
  }
  next({
    status: 400,
    message: `The entered reservation_date "${date}" is not a valid date.`,
  });
}

function hasValidTime(req, res, next) {
  const time = req.body.data.reservation_time;
  if (timeFormat.test(time)) {
    return next();
  }
  next({
    status: 400,
    message: `The entered reservation_time "${time}" is not a valid time.`
  })
}

// the people property must be an integer greater than 0
function hasValidPeople(req, res, next) {
  const people = req.body.data.people;
  if (Number.isInteger(people) && people > 0) {
    return next();
  }
  next({
    status: 400,
    message: `The entered people "${people}" is not a number greater than 0.`
  })
}

// ---- CRUD FUNCTIONS ---- //

// CREATE HANDLER FOR RESERVATIONS
async function create(req, res) {
  const reservation = await service.create(req.body.data);
  res.status(201).json({ data: reservation });
}

/**
 * List handler for reservation resources
 */
async function list(req, res) {
  res.json({
    data: [],
  });
}

module.exports = {
  create: [
    hasRequiredProperties,
    hasValidDate,
    hasValidTime,
    hasValidPeople,
    asyncErrorBoundary(create),
  ],
  list,
};
