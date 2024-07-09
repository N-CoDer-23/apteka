const { Schema, model } = require('mongoose');

const userSchema = new Schema({
    fname: { type: String, required: true },
    lname: { type: String, required: true },
    birthday: { type: String, required: true },
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    gender: { type: String },
    phonenumber: { type: Number, required: true },
    address: { type: String },
    salary: { type: String, required: true },
    idnumber: { type: String, required: true },
    type: { type: String, required: true },
    worktime: { type: String, required: true }
});

const User = model('User', userSchema);
module.exports = User;
