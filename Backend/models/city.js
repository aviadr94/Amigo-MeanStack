const mongoose = require("mongoose");

const citySchema = mongoose.Schema({
  city: { type: String, required: true },
  lat: { type: String , required: true },
  lng: { type: String , required: true },
  creator: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }
});

module.exports = mongoose.model("City", citySchema);
