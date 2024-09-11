const jwt = require('jsonwebtoken');
const { Schema, model } = require('mongoose');

// User model
const userSchema = new Schema({
    fname: { type: String, required: true },
    lname: { type: String, required: true },
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    gender: { type: String, required: true },
    address: { type: String, required: true },
    salary: { type: Number },
    idnumber: { type: String, required: true },
    phonenumber: { type: String, required: true },
    birthday: { type: Date, required: true },
    type: { type: String, required: true }, // 'hodim' yoki 'director'
    worktime: { type: String },
    maow: { type: String},
    atname: { type: String}
});
const User = model('User', userSchema);
module.exports = User;
