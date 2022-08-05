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
  });
}

function noSchedulingInPast(req, res, next) {
  const { reservation_date, reservation_time } = req.body.data;
  const requestedDate = new Date(
    `${reservation_date} ${reservation_time}`
  ).valueOf();
  const presentTime = Date.now();
  if (requestedDate > presentTime) {
    return next();
  }
  next({
    status: 400,
    message: `A new reservation must be in the future.`
  });
}

function noTuesdayScheduling(req, res, next) {
  const { reservation_date }  = req.body.data;
  const weekday = new Date(reservation_date).getUTCDay();
  if (weekday !== 2) {
    return next();
  }
  next({
    status: 400,
    message: `The restaurant is closed on Tuesdays.`
  });
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
  });
}

// ---- CRUD FUNCTIONS ---- //

// CREATE HANDLER FOR NEW RESERVATIONS
async function create(req, res) {
  const reservation = await service.create(req.body.data);
  res.status(201).json({ data: reservation });
}

// LIST HANDLER FOR RESERVATION RESOURCES
async function list(req, res) {
  const { date } = req.query;
  res.json({ data: await service.listByDate(date) });
}

module.exports = {
  create: [
    hasRequiredProperties,
    hasValidDate,
    hasValidTime,
    noSchedulingInPast,
    noTuesdayScheduling,
    hasValidPeople,
    asyncErrorBoundary(create),
  ],
  list: asyncErrorBoundary(list),
};
