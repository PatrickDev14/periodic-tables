const router = require("express").Router();
const methodNotAllowed = require("../errors/methodNotAllowed");
const controller = require("./reservations.controller");

router.route("/")
  .post(controller.create)
  .get(controller.list)
  .all(methodNotAllowed);

router.route("/:reservation_id")
  .get(controller.read)
  .all(methodNotAllowed);
  
module.exports = router;