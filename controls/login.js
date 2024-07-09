const User = require('../model/UserSchema');
const jwt = require('jsonwebtoken');

const getUser = async (req, res) => {
    try {
        const data = await User.find();
        res.json({
            success: true,
            message: "All users",
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

const generateSimpleToken = (username) => {
    return `${username}-${Date.now()}`;
};

const login = async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await User.findOne({ username });

        if (!user) {
            return res.status(401).send({
                success: false,
                message: "Username or password is incorrect!"
            });
        }

        // Compare passwords using bcrypt.compare
        const isPasswordValid = await (password, user.password);

        if (!isPasswordValid) {
            return res.status(401).send({
                success: false,
                message: "Username or password is incorrect!"
            });
        }

        // Generate token if login is successful
        const token = generateSimpleToken(user.username);
        return res.status(200).send({
            success: true,
            message: `Welcome back, ${username}!`,
            token: token
        });

    } catch (error) {
        console.error("Login error:", error);
        res.status(500).send({
            success: false,
            message: "Server error occurred"
        });
    }
};

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

        // Ma'lumotlarni tekshirish
        if (!fname || !lname || !username || !password || !gender || !salary || !idnumber || !phonenumber || !birthday || !type || !worktime) {
            return res.status(400).json({ success: false, message: "All fields are required!" });
        }

        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(400).json({ success: false, message: "Username already exists!" });
        }

        const newUser = new User({
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
        });

        await newUser.save();
        res.status(201).json({ success: true, message: "Registration successful!" });
    } catch (error) {
        console.error("Error>>", error);
        res.status(500).json({
            success: false,
            message: "Server error!"
        });
    }
};

const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;
        const deleted = await User.findByIdAndDelete(id);

        if (!deleted) {
            return res.status(404).json({
                success: false,
                message: "Foydalanuvchi topilmadi yoki allaqachon o'chirilgan!"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Foydalanuvchi muvaffaqiyatli o'chirildi"
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const updateUser = async (req, res) => {
    try {
        const editUser = await User.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );

        if (!editUser) {
            return res.status(404).send({
                success: false,
                message: "User is not updated!",
            });
        }

        res.send({
            success: true,
            message: "User is updated!",
            data: editUser
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
