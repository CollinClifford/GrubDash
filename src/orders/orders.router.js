const router = require("express").Router();
const controller = require("./orders.controller");

//imports methodNotAllowed function
const methodNotAllowed = require("../errors/methodNotAllowed");

//":orderId" routes
router
  .route("/:orderId")
  .get(controller.read)
  .put(controller.update)
  .delete(controller.delete)
  .all(methodNotAllowed);

//"/" routes
router
  .route("/")
  .get(controller.list)
  .post(controller.create)
  .all(methodNotAllowed);

module.exports = router;
