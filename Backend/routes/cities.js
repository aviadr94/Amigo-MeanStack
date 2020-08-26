const express = require("express");

const CityController = require("../controllers/cities");

const checkAuth = require("../middleware/check-auth");
const extractFile = require("../middleware/file");

const router = express.Router();

router.post("/", checkAuth, extractFile, CityController.createCity);

router.put("/:id", checkAuth, extractFile, CityController.updateCity);

router.get("", CityController.getCities);

router.get("all", CityController.getAllCities);

router.get("/:id", CityController.getCity);

router.delete("/:id", checkAuth, CityController.deleteCity);

module.exports = router;
