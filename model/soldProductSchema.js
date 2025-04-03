const { Schema, model } = require('mongoose');

const SoldProductSchema = new Schema({
  productId: Schema.Types.ObjectId,
  pharmacyId: { type: Schema.Types.ObjectId, ref: 'Pharmacy' },
  Nomi: String,
  Sotiladi: Number,
  Activ: Number,
  Donaga: Number,
  Activdona: Number,
  Card: Number,
  saleDate: { type: Date, default: Date.now }
});


const SoldProduct = model('SoldProduct', SoldProductSchema);

module.exports = SoldProduct; 
