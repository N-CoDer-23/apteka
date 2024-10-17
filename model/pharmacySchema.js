const { Schema, model } = require('mongoose');

const pharmacySchema = new Schema({
    Nomi: { type: String, required: true },
    Ishlabchiqarilgan: { type: String, required: true },
    Muddat: { type: String, required: true },
    Olingan: { type: String, required: true },
    turi: { type: String, required: true },
    Sotiladi: { type: String, required: true },
    Soni: { type: String },
    Donaga: { type: Number },
    Dona: { type: Number },
    Rasm: { type: String },
    Haqida: { type: String, required: true },
    FirmaNomi: { type: String, required: true },
    FindQuti: { type: String, required: true },
    BarCode: { type: String, required: true },
    Activ: { type: Number },
    Activdona: { type: Number },
    saleDate: { type: Date, default: Date.now },
    

});

const Product = model('product', pharmacySchema);
module.exports = Product;
