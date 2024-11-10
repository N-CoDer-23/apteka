const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const allManySchema = new Schema({
    ism: { type: String, required: true },
    sabab: { type: String, required: true },
    pulMiqdor: { type: Number, required: true },
    date: { type: Date, default: Date.now },
    pharmacyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Pharmacy', required: true } // Dorixona ID
});

const AllManyModel = mongoose.model('AllMany', allManySchema);
module.exports = AllManyModel;
