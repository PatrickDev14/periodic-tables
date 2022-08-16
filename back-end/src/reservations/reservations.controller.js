const service = require("./reservations.service");
const hasProperties = require("../errors/hasProperties");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");
// const { as } = require("../db/connection");

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

const hasRequiredCreateProperties = hasProperties(REQUIRED_PROPERTIES);
let hasRequiredUpdateProperty;

async function reservationExists(req, res, next) {
  const { reservation_id } = req.params;
  const reservation = await service.read(reservation_id);
  if (reservation) {
    res.locals.reservation = reservation;
    return next();
  }
  next({
    status: 404,
    message: `The reservation "${reservation_id}" cannot be found.`,
  });
}

function hasValidDate(req, res, next) {
  const { reservation_date }  = req.body.data;
  const valid = Date.parse(reservation_date);
  if (valid) {
    return next();
  }
  next({
    status: 400,
    message: `The entered reservation_date "${reservation_date}" is not a valid date.`,
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
    message: `A new reservation must be later today, or on a future date.`
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
    message: `The restaurant is closed on Tuesdays. Please choose another date.`
  });
}

function isDuringBusinessHours(req, res, next) {
  const { reservation_time } = req.body.data;
  if (reservation_time >= "10:30" && reservation_time <= "21:30") {
    return next();
  }
  next({
    status: 400,
    message: `Reservations can only be made from 10:30AM - 9:30PM.`
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

function hasValidCreateStatus(req, res, next) {
  const { status } = req.body.data;
  if (status === "seated" || status === "finished") {
    next({
      status: 400,
      message: `The initial status cannot be "${status};" it should be "booked".`
    });
  }
  return next();
}

function currentStatusIsNotFinished(req, res, next) {
  const { status, reservation_id } = res.locals.reservation;
  if (status !== "finished") {
    return next();
  }
  next({
    status: 400,
    message: `This reservation ${reservation_id} is already finished, and cannot be updated.`
  });
}

function statusIsNotUnknown(req, res, next) {
  const { status } = req.body.data;
  if (status !== "unknown") {
    return next();
  }
  next({
    status: 400,
    message: `The status request is unknown.`
  });
}

// ---- CRUD FUNCTIONS ---- //

// CREATE HANDLER FOR NEW RESERVATIONS
async function create(req, res) {
  const reservation = await service.create(req.body.data);
  res.status(201).json({ data: reservation });
}

async function read(req, res) {  
  res.json({ data: res.locals.reservation });
}

async function updateReservationStatus(req, res) {
  const { reservation_id } = res.locals.reservation;
  console.log(req.body.data);
  const { status } = req.body.data;
  const updatedReservation = await service.updateStatus(reservation_id, status);
  res.status(200).json({ data: updatedReservation });
}
 
// LIST HANDLER FOR RESERVATION RESOURCES
async function list(req, res) {
  const { date, mobile_number } = req.query;
  if (date) {
    res.json({ data: await service.listByDate(date) });
  }
  if(mobile_number) {
    res.json({ data: await service.listByMobileNumber(mobile_number) });
  }
}

module.exports = {
  create: [
    hasRequiredCreateProperties,
    hasValidDate,
    hasValidTime,
    noSchedulingInPast,
    noTuesdayScheduling,
    isDuringBusinessHours,
    hasValidPeople,
    hasValidCreateStatus,
    asyncErrorBoundary(create),
  ],
  read: [
    asyncErrorBoundary(reservationExists),
    read,
  ],
  updateReservationStatus: [
    asyncErrorBoundary(reservationExists),
    currentStatusIsNotFinished,
    statusIsNotUnknown,
    asyncErrorBoundary(updateReservationStatus),
  ],
  list: asyncErrorBoundary(list),
};
