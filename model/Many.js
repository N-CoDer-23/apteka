const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Mongoose modeli uchun schema yaratish
const manySchema = new Schema({
    amount: { type: Number, required: true },
});

const AlMany = mongoose.model('AlMany', manySchema);
module.exports = AlMany;
 