const { Schema, model } = require('mongoose');

const loginSchema = new Schema({
    username: { type: String, required: true },
    password: { type: String, required: true },
    // accesstime: { type: String },
    // exittime: { type: String }
});

const Login = model('login', loginSchema);
module.exports = Login;
