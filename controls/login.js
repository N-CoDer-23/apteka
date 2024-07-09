const User = require('../model/UserSchema');
const bcrypt = require('bcrypt');
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
                message: "Username yoki Parol noto'g'ri!"
            });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).send({
                success: false,
                message: "Username yoki Parol noto'g'ri!"
            });
        }

        const token = generateSimpleToken(user.username);
        return res.status(200).send({
            success: true,
            message: `Qaytib kelganingizdan xursandmiz, ${username}`,
            token: token
        });

    } catch (error) {
        console.error(error);
        res.status(500).send({
            success: false,
            message: "Server xatosi"
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

        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(400).json({ success: false, message: "Username already exists!" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
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
