const path = require("path");

// Use the existing dishes data
const dishes = require(path.resolve("src/data/dishes-data"));

//determines that the dish exists in the database
function dishExists(req, res, next) {
  const { dishId } = req.params;
  const foundDish = dishes.find((dish) => dish.id == Number(dishId));
  if (foundDish) {
    res.locals.dish = foundDish;
    return next();
  } else {
    next({
      status: 404,
      message: `Dish does not exist: ${dishId}.`,
    });
  }
}

//determines that the name being entered isn't blank
function bodyHasNameProperty(req, res, next) {
  const { data: { name, description, price, image_url } = {} } = req.body;
  if (name) {
    res.locals.name = name;
    return next();
  } else {
    next({
      status: 400,
      message: `Dish must include name`,
    });
  }
}

//determines that the name being entered isn't just ""
function bodyNamePropertyIsNotBlankQuotes(req, res, next) {
  const { data: { name, description, price, image_url } = {} } = req.body;
  if (name != '""') {
    res.locals.name = name;
    return next();
  } else {
    next({
      status: 400,
      message: `Dish must include name`,
    });
  }
}

//determines that the body being entered has Description property
function bodyHasDescriptionProperty(req, res, next) {
  const { data: { name, description, price, image_url } = {} } = req.body;
  if (description) {
    res.locals.description = description;
    return next();
  } else {
    next({
      status: 400,
      message: `Dish must include a description`,
    });
  }
}

//determines the description isn't just blank quotes
function bodyDescriptionIsNotBlankQuotes(req, res, next) {
  const { data: { name, description, price, image_url } = {} } = req.body;
  if (description != '""') {
    res.locals.description = description;
    return next();
  } else {
    next({
      status: 400,
      message: `Dish must include a description`,
    });
  }
}

//determines that the body being entered has Price property
function bodyHasPriceProperty(req, res, next) {
  const { data: { name, description, price, image_url } = {} } = req.body;
  if (price) {
    res.locals.price = price;
    return next();
  } else {
    next({
      status: 400,
      message: `Dish must include a price`,
    });
  }
}

//determines that the Price being entered is a number
function bodyHasPriceIsANumberProperty(req, res, next) {
  const { data: { name, description, price, image_url } = {} } = req.body;
  if (typeof price == "number") {
    res.locals.price = price;
    return next();
  } else {
    next({
      status: 400,
      message: `Dish must have a price that is an integer greater than 0`,
    });
  }
}

//determines that the Price is more than 0
function bodyHasPriceMoreThan0Property(req, res, next) {
  const { data: { name, description, price, image_url } = {} } = req.body;
  if (price > 0) {
    res.locals.price = price;
    return next();
  } else {
    next({
      status: 400,
      message: `Dish must have a price that is an integer greater than 0`,
    });
  }
}

//determines that the body has Url property
function bodyHasUrlProperty(req, res, next) {
  const { data: { name, description, price, image_url } = {} } = req.body;
  if (image_url) {
    res.locals.image_url = image_url;
    return next();
  } else {
    next({
      status: 400,
      message: `Dish must include a image_url`,
    });
  }
}

module.exports = {
  dishExists,
  bodyHasNameProperty,
  bodyNamePropertyIsNotBlankQuotes,
  bodyHasDescriptionProperty,
  bodyDescriptionIsNotBlankQuotes,
  bodyHasPriceProperty,
  bodyHasPriceIsANumberProperty,
  bodyHasPriceMoreThan0Property,
  bodyHasUrlProperty,
};
