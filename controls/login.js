const User = require('../model/UserSchema');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

// Barcha foydalanuvchilarni olish uchun funksiya
const getUser = async (req, res) => {
    try {
        const data = await User.find();
        res.json({
            success: true,
            message: "Barcha foydalanuvchilar",
            innerData: data
        });
    } catch (error) {
        console.error("Xato>>>", error);
        res.status(500).json({
            success: false,
            message: "Server xatosi",
            error: error.message
        });
    }
};

// Token yaratish uchun oddiy funksiya
const generateSimpleToken = (username) => {
    return `${username}-${Date.now()}`;
};

// Login qilish uchun funksiya
// Login controller
const login = async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await User.findOne({ username });

        if (!user || user.password !== password) {
            return res.status(401).send({
                success: false,
                message: "Foydalanuvchi nomi yoki paroli noto'g'ri!"
            });
        }

        const token = jwt.sign({ username: user.username, userType: user.type }, 'your_jwt_secret_key', { expiresIn: '1h' });

        return res.status(200).send({
            success: true,
            message: `Xush kelibsiz, ${username}!`,
            token: token,
            userType: user.type
        });

    } catch (error) {
        console.error("Login xatosi:", error);
        res.status(500).send({
            success: false,
            message: "Server xatosi yuz berdi"
        });
    }
};



// Yangi foydalanuvchi yaratish
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
        if (!fname || !lname || !username || !password || !gender || !address || !salary || !idnumber || !phonenumber || !birthday || !type || !worktime) {
            return res.status(400).json({ success: false, message: "Barcha maydonlarni to'ldiring!" });
        }

        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(400).json({ success: false, message: "Foydalanuvchi nomi allaqachon mavjud!" });
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
        res.status(201).json({ success: true, message: "Ro'yxatdan o'tish muvaffaqiyatli!" });
    } catch (error) {
        console.error("Xato>>", error);
        res.status(500).json({
            success: false,
            message: "Server xatosi!"
        });
    }
};


// Foydalanuvchini o'chirish uchun funksiya
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

// Foydalanuvchini yangilash uchun funksiya
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
                message: "Foydalanuvchi yangilanmadi!",
            });
        }

        res.send({
            success: true,
            message: "Foydalanuvchi yangilandi!",
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
