const router = require("express").Router();
const methodNotAllowed = require("../errors/methodNotAllowed");
const controller = require("./tables.controller");

router
  .route("/")
  .post(controller.create)
  .get(controller.list)
  .all(methodNotAllowed);

router
  .route("/:table_id")
  .get(controller.read)
  .all(methodNotAllowed);

router
  .route("/:table_id/seat")
  .put(controller.updateReservationSeating)
  .delete(controller.finishedEating)
  .all(methodNotAllowed);


  module.exports = router;

