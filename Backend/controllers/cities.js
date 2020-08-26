const City = require("../models/city");

exports.createCity = (req, res, next) => {
  const url = req.protocol + "://" + req.get("host");
  const city = new City({
    city: req.body.city,
    lat: req.body.lat,
    lng: req.body.lng,
    creator: req.userData.userId
  });
  city.save()
    .then(createdCity => {
      res.status(201).json({
        message: "City added successfully",
        city: {
          ...createdCity,
          id: createdCity._id
        }
      });
    })
    .catch(error => {
      res.status(500).json({
        message: "Creating a city failed!"
      });
    });
};

exports.updateCity = (req, res, next) => {
  const city = new City({
    _id: req.body.id,
    city: req.body.city,
    lat: req.body.lat,
    lng: req.body.lng,
    creator: req.userData.userId
  });
  City.updateOne({ _id: req.params.id, creator: req.userData.userId }, city)
    .then(result => {
      if (result.n > 0) {
        res.status(200).json({ message: "Update successful!" });
      } else {
        res.status(401).json({ message: "Not authorized!" });
      }
    })
    .catch(error => {
      res.status(500).json({
        message: "Couldn't udpate city!"
      });
    });
};

exports.getCities = (req, res, next) => {
  const pageSize = +req.query.pagesize;
  const currentPage = +req.query.page;
  const cityQuery = City.find();
  let fetchedCities;
  if (pageSize && currentPage) {
    cityQuery.skip(pageSize * (currentPage - 1)).limit(pageSize);
  }
  cityQuery
    .then(documents => {
      fetchedCities = documents;
      return City.count();
    })
    .then(count => {
      res.status(200).json({
        message: "City fetched successfully!",
        cities: fetchedCities,
        maxCities: count
      });
    })
    .catch(error => {
      res.status(500).json({
        message: "Fetching cities failed!"
      });
    });
};

exports.getCity = (req, res, next) => {
  City.findById(req.params.id)
    .then(city => {
      if (city) {
        res.status(200).json(city);
      } else {
        res.status(404).json({ message: "city not found!" });
      }
    })
    .catch(error => {
      res.status(500).json({
        message: "Fetching city failed!"
      });
    });
};

exports.deleteCity = (req, res, next) => {
  City.deleteOne({ _id: req.params.id, creator: req.userData.userId })
    .then(result => {
      console.log(result);
      if (result.n > 0) {
        res.status(200).json({ message: "Deletion successful!" });
      } else {
        res.status(401).json({ message: "Not authorized!" });
      }
    })
    .catch(error => {
      res.status(500).json({
        message: "Deleting city failed!"
      });
    });
};


exports.getAllCities = (req, res, next) => {
  const cityQuery = City.find();
  cityQuery
    .then(documents => {
      fetchedCities = documents;
      return City.count();
    })
    .then(count => {
      res.status(200).json({
        message: "City fetched successfully!",
        cities: fetchedCities,
        maxCities: count
      });
    })
    .catch(error => {
      res.status(500).json({
        message: "Fetching cities failed!"
      });
    });
};
