const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Order = new Schema({
  user_id: {
    type: mongoose.Types.ObjectId,
    ref: "User",
  },
  order_date: { type: Date, default: Date.now },
  total_price: { type: Number, default: 0 },
  status: { type: String, maxLength: 255 },
});

module.exports = mongoose.model("Order", Order);
