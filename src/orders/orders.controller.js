const path = require("path");
const { disconnect } = require("process");

// Use the existing order data
const orders = require(path.resolve("src/data/orders-data"));

// Use this function to assigh ID's when necessary
const nextId = require("../utils/nextId");

//imports middleware functions
const middleware = require("./middleware");

//lists all orders
function list(req, res, next) {
  res.json({ data: orders });
}

//creates a new order and assigns id
function create(req, res, next) {
  const { data: { deliverTo, mobileNumber, status, dishes } = {} } = req.body;
  const newId = nextId();
  const newOrder = {
    id: newId,
    deliverTo,
    mobileNumber,
    status,
    dishes,
  };
  orders.push(newOrder);
  res.status(201).json({ data: newOrder });
}

//fetches a single order
function read(req, res) {
  res.json({ data: res.locals.order });
}

//updates existing item
function update(req, res, next) {
  let order = res.locals.order;
  const orderId = order.id;
  const { data: { id, deliverTo, mobileNumber, status, dishes } = {} } =
    req.body;
  if (orderId === id || !id) {
    order.id = orderId;
    order.deliverTo = deliverTo;
    order.mobileNumber = mobileNumber;
    order.status = status;
    order.dishes = dishes;
    res.json({ data: order });
  }
  next({
    status: 400,
    message: `order id does not match route id. Order: ${id}, Route: ${orderId}`,
  });
}

//deletes an order
function destroy(req, res, next) {
  const { orderId } = req.params;
  const status = orders.map((order) => order.status);
  if (status.toString() !== "pending") {
    next({
      status: 400,
      message: "An order cannot be deleted unless it is pending",
    });
  } else {
    const index = orders.findIndex((order) => order.id === Number(orderId));
    const deletedOrders = orders.splice(index, 1);
    res.sendStatus(204);
  }
}

module.exports = {
  list,
  create: [
    middleware.bodyHasDeliverToProperty,
    middleware.bodyDeliverToIsNotBlankQuotes,
    middleware.bodyHasMobileNumberProperty,
    middleware.bodyMobileNumberIsNotBlankQuotes,
    middleware.bodyHasDishesProperty,
    middleware.bodyDishesLengthMoreThanZero,
    middleware.bodyDishesIsArray,
    middleware.quantityHasAnInteger,
    middleware.quantityIsAnInteger,
    middleware.quantityIsMoreThanZero,
    create,
  ],
  read: [middleware.orderExists, read],
  update: [
    middleware.orderExists,
    middleware.orderHasStatusProperty,
    middleware.orderHasStatusDelivered,
    middleware.idDoesNotMatch,
    middleware.bodyHasDeliverToProperty,
    middleware.bodyDeliverToIsNotBlankQuotes,
    middleware.bodyHasMobileNumberProperty,
    middleware.bodyMobileNumberIsNotBlankQuotes,
    middleware.bodyHasDishesProperty,
    middleware.bodyDishesLengthMoreThanZero,
    middleware.bodyDishesIsArray,
    middleware.quantityHasAnInteger,
    middleware.quantityIsAnInteger,
    middleware.quantityIsMoreThanZero,
    update,
  ],
  delete: [middleware.orderExists, destroy],
};
