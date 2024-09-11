const { Schema, model } = require('mongoose');

const SoldProductSchema = new Schema({
  Nomi: String,
  Sotiladi: Number,
  Activ: Number,
  Donaga: Number,
  Activdona: Number,
  saleDate: String,
});

const SoldProduct = model('SoldProduct', SoldProductSchema); // Model name should match here

module.exports = SoldProduct;
