const path = require("path");

// Use the existing dishes data
const dishes = require(path.resolve("src/data/dishes-data"));

// Use this function to assign ID's when necessary
const nextId = require("../utils/nextId");

//imports middleware functions
const middleware = require("./middleware");

//lists all of the items in the database
function list(req, res, next) {
  res.json({ data: dishes });
}

//creates new item and posts to database
function create(req, res, next) {
  const { data: { name, description, price, image_url } = {} } = req.body;
  const newId = nextId();
  const newDish = {
    id: newId,
    name,
    description,
    price,
    image_url,
  };
  dishes.push(newDish);
  res.status(201).json({ data: newDish });
}

//list item by it's id as determined with the dishExists middleware
function read(req, res) {
  res.json({ data: res.locals.dish });
}

//updates existing item
function update(req, res, next) {
  let dish = res.locals.dish;
  const dishId = dish.id;
  const { data: { id, name, description, price, image_url } = {} } = req.body;
  if (dishId === id || !id) {
    const updateDish = {
      id: dish.id,
      name,
      description,
      price,
      image_url,
    };
    dish = updateDish;
    res.json({ data: dish });
  }
  next({
    status: 400,
    message: `Dish id does not match route id. Dish: ${id}, Route: ${dishId}`,
  });
}

module.exports = {
  list,
  create: [
    middleware.bodyHasNameProperty,
    middleware.bodyNamePropertyIsNotBlankQuotes,
    middleware.bodyHasDescriptionProperty,
    middleware.bodyDescriptionIsNotBlankQuotes,
    middleware.bodyHasPriceProperty,
    middleware.bodyHasPriceMoreThan0Property,
    middleware.bodyHasPriceIsANumberProperty,
    middleware.bodyHasUrlProperty,
    create,
  ],
  read: [middleware.dishExists, read],
  update: [
    middleware.dishExists,
    middleware.bodyHasNameProperty,
    middleware.bodyNamePropertyIsNotBlankQuotes,
    middleware.bodyHasDescriptionProperty,
    middleware.bodyDescriptionIsNotBlankQuotes,
    middleware.bodyHasPriceProperty,
    middleware.bodyHasPriceMoreThan0Property,
    middleware.bodyHasPriceIsANumberProperty,
    middleware.bodyHasUrlProperty,
    update,
  ],
};
