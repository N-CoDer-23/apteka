const User = require('../model/UserSchema');
const Login = require('../model/LoginSchema');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const getUser = async (req, res) => {
    try {
        const data = await User.find();
        res.json({
            success: true,
            message: "All user",
            innerData: data
        });
    } catch (error) {
        console.error("Error>>>", error);
        res.status(500).json({
            success: false,
            message: "Server error",
            error: error.message
        });
    }
};

// -------Login - Sign in-------------
const login = async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await Login.findOne({ username, password });

        if (!user) {
            return res.status(401).send({
                success: false,
                message: "Username or Password invalid!"
            });
        }

        if (await bcrypt.compare(password, user.password)) {
            const token = jwt.sign({ username: user.username }, "Secret");
            return res.status(200).send({
                success: true,
                message: `Welcome back ${username}`,
                token: token
            });
        } else {
            res.status(401).send({
                success: false,
                message: "Username or Password invalid!"
            });
        }
    } catch (error) {
        console.error(error);
        res.status(500).send({
            success: false,
            message: "Server error"
        });
    }
};

// -----Register - Sign Up-------
const createUser = async (req, res) => {
    try {
        const {
            fname,
            lname,
            username,
            password,
            gender,
            address,
            salary,
            idnumber,
            phonenumber,
            birthday,
            type,
            worktime
        } = req.body;
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            res.json("Username already exists!");
        } else {
            let hashedPassword = await bcrypt.hash(password, 10);
            const newUser = new User({
                fname,
                lname,
                username,
                password: hashedPassword,
                gender,
                address,
                salary,
                idnumber,
                phonenumber,
                birthday,
                type,
                worktime
            });
            await newUser.save();
            res.json("Registration successful!");
        }
    } catch (error) {
        console.error("Error>>", error);
        res.json({
            success: false,
            message: "Server error!"
        });
    }
};

// ---------Delete - User---------
const deleteUser = async (req, res) => {
    try {
        let { id } = req.params;
        console.log(id);
        let deleted = await User.findByIdAndDelete(id);

        if (!deleted) {
            return res.status(404).json({
                success: false,
                message: "Foydalanuvchi topilmadi yoki allaqachon o'chirilgan!"
            });
        }

        // Foydalanuvchi muvaffaqiyatli o'chirildi
        return res.status(200).json({
            success: true,
            message: "Foydalanuvchi muvaffaqiyatli o'chirildi"
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// ------Update User-----------
const updateUser = async (req, res) => {
    try {
        
        let editUser = await User.findByIdAndUpdate(
            req.params._id,
            req.body
        );
console.log(editUser);
        if (!editUser) {
            return res.status(404).send({
                success: false,
                message: "User is not updated!",
                token: null
            });
        }

        res.send({
            success: true,
            message: "User is updated!",
            token: editUser
        });
    } catch (error) {
        res.status(500).send({ success: false, message: error.message });
    }
};


module.exports = {
    getUser,
    login,
    createUser,
    deleteUser,
    updateUser
};
