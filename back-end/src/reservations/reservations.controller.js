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

const hasRequiredCreateProperties = hasProperties(REQUIRED_PROPERTIES);
const hasRequiredUpdateProperties = hasProperties(REQUIRED_PROPERTIES);

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

async function create(req, res) {
  const reservation = await service.create(req.body.data);
  res.status(201).json({ data: reservation });
}

async function read(req, res) {  
  res.json({ data: res.locals.reservation });
}

async function update(req, res) {
  const updatedReservation = {...req.body.data};
  const { reservation_id } = req.params;
  res.status(200).json({ data: await service.update(reservation_id, updatedReservation)});
}

async function updateReservationStatus(req, res) {
  const { reservation_id } = res.locals.reservation;
  const { status } = req.body.data;
  const updatedReservation = await service.updateStatus(reservation_id, status);
  res.status(200).json({ data: updatedReservation });
}
 
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
  update: [
    asyncErrorBoundary(reservationExists),
    hasRequiredUpdateProperties,
    hasValidDate,
    hasValidTime,
    noSchedulingInPast,
    noTuesdayScheduling,
    isDuringBusinessHours,
    hasValidPeople,
    asyncErrorBoundary(update),
  ],
  updateReservationStatus: [
    asyncErrorBoundary(reservationExists),
    currentStatusIsNotFinished,
    statusIsNotUnknown,
    asyncErrorBoundary(updateReservationStatus),
  ],
  list: asyncErrorBoundary(list),
};