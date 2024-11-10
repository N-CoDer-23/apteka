const { Schema, model } = require('mongoose');

const pharmacyModel = new Schema({
    pharmacyName: { type: String, required: true },
    location: { type: String },
    contactNumber: { type: String },
    ownerName: { type: String },
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    type: { type: String, required: true }
}, { timestamps: true });

const Pharmacy = model('Pharmacy', pharmacyModel);
module.exports = Pharmacy;
