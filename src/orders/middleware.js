const { response } = require("express");
const path = require("path");
const { disconnect } = require("process");

// Use the existing order data
const orders = require(path.resolve("src/data/orders-data"));

//determines that the order exists
function orderExists(req, res, next) {
  const { orderId } = req.params;
  const foundOrder = orders.find((order) => order.id == Number(orderId));
  if (foundOrder) {
    res.locals.order = foundOrder;
    return next();
  } else {
    next({
      status: 404,
      message: `order id not found: ${orderId}`,
    });
  }
}

//determines that body has Deliver To property
function bodyHasDeliverToProperty(req, res, next) {
  const { data: { deliverTo, mobileNumber, status, dishes } = {} } = req.body;
  if (deliverTo) {
    res.locals.deliverTo = deliverTo;
    return next();
  } else {
    next({
      status: 400,
      message: `Order must include a deliverTo`,
    });
  }
}

//determines that body isn't just blank quotes
function bodyDeliverToIsNotBlankQuotes(req, res, next) {
  const { data: { deliverTo, mobileNumber, status, dishes } = {} } = req.body;
  if (deliverTo != '""') {
    res.locals.deliverTo = deliverTo;
    return next();
  } else {
    next({
      status: 400,
      message: `Order must include a deliverTo`,
    });
  }
}

//determines that body has mobile number property
function bodyHasMobileNumberProperty(req, res, next) {
  const { data: { deliverTo, mobileNumber, status, dishes } = {} } = req.body;
  if (mobileNumber) {
    res.locals.mobileNumber = mobileNumber;
    return next();
  } else {
    next({
      status: 400,
      message: `Order must include a mobileNumber`,
    });
  }
}

//determines that mobile number is not just blank quotes
function bodyMobileNumberIsNotBlankQuotes(req, res, next) {
  const { data: { deliverTo, mobileNumber, status, dishes } = {} } = req.body;
  if (mobileNumber != '""') {
    res.locals.mobileNumber = mobileNumber;
    return next();
  } else {
    next({
      status: 400,
      message: `Order must include a mobileNumber`,
    });
  }
}

//determines that the body has dishes array
function bodyHasDishesProperty(req, res, next) {
  const { data: { deliverTo, mobileNumber, status, dishes } = {} } = req.body;
  if (dishes) {
    res.locals.dishes = dishes;
    return next();
  } else {
    next({
      status: 400,
      message: `Order must include a dish`,
    });
  }
}

//determines that the dishes.length is greater than 0 and is an array
function bodyDishesLengthMoreThanZero(req, res, next) {
  const { data: { deliverTo, mobileNumber, status, dishes } = {} } = req.body;
  if (dishes.length > 0) {
    res.locals.dishes = dishes;
    return next();
  } else {
    next({
      status: 400,
      message: `Order must include at least one dish`,
    });
  }
}

//determines that dishes is an array
function bodyDishesIsArray(req, res, next) {
  const { data: { deliverTo, mobileNumber, status, dishes } = {} } = req.body;
  if (Array.isArray(dishes)) {
    res.locals.dishes = dishes;
    return next();
  } else {
    next({
      status: 400,
      message: `Order must include at least one dish`,
    });
  }
}

//determines that quantity HAS an integer
function quantityHasAnInteger(req, res, next) {
  const { data: { deliverTo, mobileNumber, status, dishes } = {} } = req.body;
  const index = dishes.map((dish) => dish.id);
  const dishQuantity = dishes.map((dish) => dish.quantity);
  dishQuantity.forEach((dish) => {
    if (!dish) {
      next({
        status: 400,
        message: `Dish ${index} must have a quantity that is an integer greater than 0`,
      });
    }
  });
  res.locals.dishes = dishes;
  next();
}

//determines that quanity IS an integer
function quantityIsAnInteger(req, res, next) {
  const { data: { deliverTo, mobileNumber, status, dishes } = {} } = req.body;
  const index = dishes.map((dish) => dish.id);
  const dishQuantity = dishes.map((dish) => dish.quantity);
  dishQuantity.forEach((dish) => {
    if (typeof dish !== "number") {
      next({
        status: 400,
        message: `Dish ${index} must have a quantity that is an integer greater than 0`,
      });
    }
  });
  res.locals.dishes = dishes;
  next();
}

//determines that the quantity is more than 0
function quantityIsMoreThanZero(req, res, next) {
  const { data: { deliverTo, mobileNumber, status, dishes } = {} } = req.body;
  const index = dishes.map((dish) => dish.id);
  const dishQuantity = dishes.map((dish) => dish.quantity);
  dishQuantity.forEach((number) => {
    if (number > 0) {
      res.locals.dishes = dishes;
      next();
    } else {
      next({
        status: 400,
        message: `Dish ${index} must have a quantity that is an integer greater than 0`,
      });
    }
  });
}

/* 
id of body does not match :orderId from the route	

Order id does not match route id. Order: ${id}, Route: ${orderId}.
*/

function idDoesNotMatch(req, res, next) {
  const { orderId } = req.params;
  const { data: { id, deliverTo, mobileNumber, status, dishes } = {} } =
    req.body;
  console.log(orderId, id);
  if (orderId === id || !id) {
    res.locals.status = status;
    return next();
  } else {
    next({
      status: 400,
      message: `Order id does not match route id. Order: ${id}, Route: ${orderId}`,
    });
  }
}

//determines if status is empty
function orderHasStatusProperty(req, res, next) {
  const { data: { id, deliverTo, mobileNumber, status, dishes } = {} } =
    req.body;
  if (!status || status === "invalid") {
    next({
      status: 400,
      message:
        "Order must have a status of pending, preparing, out-for-delivery, delivered",
    });
  } else {
    res.locals.status = status;
    return next();
  }
}

//determines if the order has been delivered
function orderHasStatusDelivered(req, res, next) {
  const { data: { id, deliverTo, mobileNumber, status, dishes } = {} } =
    req.body;
  if (status === "delivered") {
    next({
      status: 400,
      message: "A delivered order cannot be changed",
    });
  } else {
    res.locals.status = status;
    return next();
  }
}

module.exports = {
  orderExists,
  bodyHasDeliverToProperty,
  bodyDeliverToIsNotBlankQuotes,
  bodyHasMobileNumberProperty,
  bodyMobileNumberIsNotBlankQuotes,
  bodyHasDishesProperty,
  bodyDishesLengthMoreThanZero,
  bodyDishesIsArray,
  quantityHasAnInteger,
  quantityIsAnInteger,
  quantityIsMoreThanZero,
  orderHasStatusProperty,
  orderHasStatusDelivered,
  idDoesNotMatch,
};
