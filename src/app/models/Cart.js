const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CartItemSchema = new Schema({
  product: { 
    type: Schema.Types.ObjectId, 
    ref: 'Product', 
    required: true },
  quantity: { 
    type: Number, 
    required: true },
  color: { 
    type: String, 
    required: true }
});

const CartSchema = new Schema({
  items: [CartItemSchema],
  user: { 
    type: Schema.Types.ObjectId, 
    ref: 'User', 
    required: true }
});

const Cart = mongoose.model('Cart', CartSchema);
module.exports = Cart;