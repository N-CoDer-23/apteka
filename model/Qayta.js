const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const QaytaManySchema = new Schema({
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        
    },
    qaytarilganQuti: {
        type: Number,
        required: true,
    },
    qaytarilganNomi: {
        type: String,
        required: true,
    },
    qaytarilganDona: {
        type: Number,
        required: true,
    },
    qaytarilganNarxi: {
        type: Number,
        required: true,
    },
    qaytarishVaqti: {
        type: Date,
        default: Date.now,
    },
    pharmacyId: { type: Schema.Types.ObjectId, ref: 'Pharmacy', required: true } // Dorixona ID si
});

module.exports = mongoose.model('QaytaMany', QaytaManySchema);
