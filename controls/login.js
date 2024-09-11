const User = require('../model/UserSchema');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
require('dotenv').config(); // .env fayldan ma'lumotlarni olish

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

// Login qilish uchun funksiya
const login = async (req, res) => {
    try {
      const { username, password } = req.body;
      console.log("Received login request for username:", username);
  
      const user = await User.findOne({ username });
      if (!user) {
        console.log("User not found:", username);
        return res.status(401).send({
          success: false,
          message: "Foydalanuvchi nomi yoki paroli noto'g'ri!"
        });
      }
  
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        console.log("Password does not match for username:", username);
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
            worktime,
            atname
        } = req.body;

        // Ma'lumotlarni tekshirish
        if (!fname || !lname || !username || !password || !gender || !address || !idnumber || !phonenumber || !birthday || !type || (!salary && type !== 'direktor') || (!worktime && type !== 'direktor') || (!atname && type === 'direktor')) {
            return res.status(400).json({ success: false, message: "Barcha maydonlarni to'ldiring!" });
        }

        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(400).json({ success: false, message: "Foydalanuvchi nomi allaqachon mavjud!" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({
            fname,
            lname,
            username,
            password: hashedPassword,
            gender,
            address,
            salary: type !== 'direktor' ? salary : undefined,
            idnumber,
            phonenumber,
            birthday,
            type,
            worktime: type !== 'direktor' ? worktime : undefined,
            atname: type === 'direktor' ? atname : undefined
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
// Dorixona nomini olish uchun funksiya
const getPharmacyName = async (req, res) => {
    try {
        // Foydalanuvchi yoki dorixona ma'lumotlarini olish uchun moslash
        const pharmacyName = "Dorixona Nomi"; // Bu yerda dorixona nomini olish uchun real kodni yozing
        res.json({
            success: true,
            pharmacyName: pharmacyName
        });
    } catch (error) {
        console.error("Dorixona nomini olishda xatolik:", error);
        res.status(500).json({
            success: false,
            message: "Server xatosi"
        });
    }
};


module.exports = {
    getUser,
    login,
    createUser,
    deleteUser,
    updateUser,
    getPharmacyName
};
