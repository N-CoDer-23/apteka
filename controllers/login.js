const User = require('../model/UserSchema');
const Pharmacy = require('../model/newPharm');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
require('dotenv').config(); // .env fayldan ma'lumotlarni olish

// Foydalanuvchini olish (Read)
const getUsers = async (req, res) => {
    try {
        const { pharmacyId } = req.user; // Token orqali dorixona ID sini olish
        const users = await User.find({ pharmacyId }); // Faqat shu dorixonaga tegishli foydalanuvchilar
        res.status(200).json({ success: true, message: "Foydalanuvchilar olindi!", innerData: users });
    } catch (error) {
        res.status(500).json({ success: false, message: "Foydalanuvchilarni olishda xatolik!" });
    }
};

// Bitta foydalanuvchini olish (Read one user)
const getUserById = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findById(id);

        if (!user) {
            return res.status(404).json({ success: false, message: "Foydalanuvchi topilmadi!" });
        }

        // Foydalanuvchi ID'sini tekshirish
        if (req.user.userId !== user._id.toString()) {
            return res.status(403).json({ success: false, message: "Sizda bu foydalanuvchi ma'lumotlariga kirish huquqi yo'q!" });
        }

        res.status(200).json({ success: true, user });
    } catch (error) {
        res.status(500).json({ success: false, message: "Foydalanuvchini olishda xatolik!" });
    }
};


// Login qilish uchun funksiya
// const login = async (req, res) => {
//     try {
//         const { username, password, pharmacyName } = req.body;

//         // Foydalanuvchini username bo'yicha qidirish
//         const user = await User.findOne({ username });
//         if (!user) {
//             return res.status(401).send({
//                 success: false,
//                 message: "Foydalanuvchi nomi yoki paroli noto'g'ri!"
//             });
//         }
//         console.log('User:', user);

//         // Parolni tekshirish
//         const isMatch = await bcrypt.compare(password, user.password);
//         if (!isMatch) {
//             return res.status(401).send({
//                 success: false,
//                 message: "Foydalanuvchi nomi yoki paroli noto'g'ri!"
//             });
//         }

//         // Dorixona ma'lumotlarini olish
//         const pharmacy = await Pharmacy.findOne({ _id: user.pharmacyId });
//         if (!pharmacy) {
//             return res.status(401).send({
//                 success: false,
//                 message: "Dorixona topilmadi!"
//             });
//         }
//         console.log('Pharmacy:', pharmacy);

//         // Dorixona nomini tekshirish
//         if (pharmacy.name !== pharmacyName) {
//             return res.status(401).send({
//                 success: false,
//                 message: "Dorixona nomi noto'g'ri!"
//             });
//         }

//         // Token yaratish
//         const token = jwt.sign(
//             { 
//                 userId: user._id, 
//                 username: user.username, 
//                 userType: user.type, 
//                 pharmacyId: user.pharmacyId, // Dorixona ID sini token ichiga qo'shish
//                 pharmacyName: pharmacy.name // Dorixona nomini token ichiga qo'shish
//             }, 
//             process.env.JWT_SECRET_KEY || 'your_jwt_secret_key', 
//             { expiresIn: '1h' }
//         );

//         return res.status(200).send({
//             success: true,
//             message: `Xush kelibsiz, ${username}!`,
//             token: token,
//             userType: user.type,
//             pharmacyId: user.pharmacyId, // Dorixona ID ni yuborish
//             pharmacyName: pharmacy.name // Dorixona nomini yuborish
//         });

//     } catch (error) {
//         res.status(500).send({
//             success: false,
//             message: "Server xatosi yuz berdi"
//         });
//     }
// };



// Login qilish uchun funksiya
const login = async (req, res) => {
    try {
        const { username, password } = req.body;

        // Foydalanuvchini User modelidan username bo'yicha qidirish
        let user = await User.findOne({ username });
        let userType = 'user';

        // Agar User modelidan topilmasa, Pharmacy modelidan qidirish
        if (!user) {
            user = await Pharmacy.findOne({ username });
            userType = 'pharmacy'; // User turini farqlash uchun belgilash
        }

        // Agar ikkala modeldan ham topilmasa
        if (!user) {
            return res.status(401).send({
                success: false,
                message: "Foydalanuvchi nomi yoki paroli noto'g'ri!"
            });
        }

        // Parolni tekshirish
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).send({
                success: false,
                message: "Foydalanuvchi nomi yoki paroli noto'g'ri!"
            });
        }

        // Token yaratish
        const token = jwt.sign(
            { 
                userId: user._id, 
                username: user.username, 
                userType: user.type || userType, 
                pharmacyId: user.pharmacyId || user._id // Dorixona ID sini token ichiga qo'shish
            }, 
            process.env.JWT_SECRET_KEY || '8767io87078hbt07b08', 
            { expiresIn: '30d' }
        );

        return res.status(200).send({
            success: true,
            message: `Xush kelibsiz, ${username}!`,
            token: token,
            userType: user.type || userType,
            pharmacyId: user.pharmacyId || user._id // Dorixona ID ni yuborish
        });

    } catch (error) {
        console.error("Login error:", error); // Xato haqida ma'lumot berish
        res.status(500).send({
            success: false,
            message: "Server xatosi yuz berdi",
            error: error.message // Xatoni ko'rsatish
        });
    }
};




// Foydalanuvchini yaratish (Create)
const createUser = async (req, res) => {
    try {
        const {
            fname, lname, username, password, gender, address, idnumber,
            phonenumber, birthday, type, salary, worktime, pharmacyId // pharmacyId ni olish
        } = req.body;

        // Tekshirishlar
        if (!fname || !lname || !username || !password || !gender || !address || !idnumber || !phonenumber || !birthday || !type || !pharmacyId) {
            return res.status(400).json({ success: false, message: "Barcha maydonlarni to'ldiring!" });
        }

        // Foydalanuvchi nomi mavjudligini tekshirish
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(400).json({ success: false, message: "Foydalanuvchi nomi allaqachon mavjud!" });
        }

        // Parolni hash qilish
        const hashedPassword = await bcrypt.hash(password, 10);

        // Yangi foydalanuvchi yaratish
        const newUser = new User({
            fname, lname, username, password: hashedPassword, gender, address, idnumber,
            phonenumber, birthday, type, worktime, salary, pharmacyId // pharmacyId ni qo'shish
        });

        // Saqlash
        await newUser.save();
        
        // Muvaffaqiyatli javob
        res.status(201).json({ success: true, message: "Foydalanuvchi muvaffaqiyatli yaratildi!" });
    } catch (error) {
        console.error("Xato:", error);
        res.status(500).json({ success: false, message: "Serverda xatolik!" });
    }
};





// Foydalanuvchini yangilash (Update)
const updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const updatedData = req.body;

        if (updatedData.password) {
            updatedData.password = await bcrypt.hash(updatedData.password, 10);
        }

        const updatedUser = await User.findByIdAndUpdate(id, updatedData, { new: true });

        if (!updatedUser) {
            return res.status(404).json({ success: false, message: "Foydalanuvchi topilmadi!" });
        }

        res.status(200).json({ success: true, message: "Foydalanuvchi yangilandi!", user: updatedUser });
    } catch (error) {
        res.status(500).json({ success: false, message: "Foydalanuvchini yangilashda xatolik!" });
    }
};

// Foydalanuvchini o'chirish (Delete)
const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedUser = await User.findByIdAndDelete(id);

        if (!deletedUser) {
            return res.status(404).json({ success: false, message: "Foydalanuvchi topilmadi!" });
        }

        res.status(200).json({ success: true, message: "Foydalanuvchi o'chirildi!" });
    } catch (error) {
        res.status(500).json({ success: false, message: "Foydalanuvchini o'chirishda xatolik!" });
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
    createUser,
    getUsers,
    getUserById,
    updateUser,
    deleteUser,
    login,
    getPharmacyName
};
