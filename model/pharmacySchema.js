const { Schema, model } = require('mongoose');

const pharmacySchema = new Schema({
    Nomi: { 
        type: String,
        required: true
    },
    Ishlabchiqarilgan: {
        type: String,
        required: true
    },
    Muddat: {
        type: String,
        required: true
    },
    Olingan: {
        type: String,
        required: true
    },
    Sotiladi: {
        type: String,
        required: true
    },
    Rasm: {
        type: String,
    },
    Haqida: {
        type: String,
        required: true
    },
    FirmaNomi: {
        type: String,
        required: true
    }
});

const Product = model('product', pharmacySchema);
module.exports = Product;
