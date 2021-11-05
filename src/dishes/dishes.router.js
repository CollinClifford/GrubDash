const router = require("express").Router();
const controller = require("./dishes.controller");

//imports methodNotAllowed function
const methodNotAllowed = require("../errors/methodNotAllowed");

//":dishId" routes
router
  .route("/:dishId")
  .get(controller.read)
  .put(controller.update)
  .all(methodNotAllowed);

//"/" routes
router
  .route("/")
  .get(controller.list)
  .post(controller.create)
  .all(methodNotAllowed);

module.exports = router;
