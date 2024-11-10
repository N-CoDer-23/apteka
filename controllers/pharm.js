
const Product = require('../model/pharmacySchema');
const SoldProduct = require('../model/soldProductSchema');
const multer = require('multer');
const WithdrawModel = require('../model/AllManyModel');
const path = require('path');
const authMiddleware = require('../controllers/auth.middleware');
const newPharm = require('../model/newPharm'); // newPharm ni to'g'ri joydan import qiling
const User = require('../model/UserSchema');

// Multer storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, 'uploads/'),
    filename: (req, file, cb) => cb(null, file.originalname)
});

const upload = multer({ storage });

// Product search by pharmacyId
const searchPharm = async (req, res) => {
    const { query } = req.query; // Qidiruv so'rovi
    const { pharmacyId } = req.user; // Foydalanuvchining dorixona IDsi

    try {
        const pharms = await Product.find({
            pharmacyId, // Faqat o'z dorixonasi uchun
            $or: [
                { Nomi: { $regex: query, $options: 'i' } }, // Nomi bo'yicha qidirish
                { Haqida: { $regex: query, $options: 'i' } }, // Haqida bo'yicha qidirish
                { BarCode: { $regex: query, $options: 'i' } } // BarCode bo'yicha qidirish
            ]
        });

        res.json({
            success: true,
            message: pharms.length ? "Dorilar muvaffaqiyatli topildi!" : "Qidiruvga mos dorilar topilmadi.",
            innerData: pharms
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};


// Get all products by pharmacyId
const getPharm = async (req, res) => {
    try {
        const { pharmacyId } = req.params; // URL parametridan pharmacyId olish
        if (!pharmacyId) {
            return res.status(400).json({ success: false, message: "Pharmacy ID yetishmaydi." });
        }

        // 'pharmacyId' ni konsolga chiqarish
        // console.log('Pharmacy ID:', pharmacyId);
        
        const pharmData = await Product.find({ pharmacyId });
        if (!pharmData) {
            return res.status(404).json({ success: false, message: "Dorixona ma'lumotlari topilmadi." });
        }
        
        res.status(200).json({ success: true, message: "Dorixona ma'lumotlari topildi!", innerData: pharmData });
    } catch (error) {
        console.error("Dorixona ma'lumotlarini olishda xatolik:", error.message);
        res.status(500).json({ success: false, message: 'Serverda xatolik yuz berdi!' });
    }
};


// Create product for a specific pharmacy
const createPharm = async (req, res) => {
    if (!req.user) {
        return res.status(401).json({ success: false, message: "Foydalanuvchi autentifikatsiyadan o'tmagan." });
    }

    const { pharmacyId } = req.user; // Foydalanuvchi ma'lumotlaridan pharmacyId olish

    const {
        Nomi, Ishlabchiqarilgan, Muddat, turi, Olingan, Sotiladi, Soni, Donaga, Dona, FindQuti, BarCode, Haqida, FirmaNomi, pulMiqdor, sabab, date
    } = req.body;

    // Barcha majburiy maydonlarni tekshirish
    const requiredFields = [Nomi, Ishlabchiqarilgan, Muddat, turi, Olingan, Sotiladi, FindQuti, Soni, Donaga, Dona, BarCode, Haqida, FirmaNomi];
    if (requiredFields.some(field => !field)) {
        return res.status(400).json({ success: false, message: "Barcha majburiy maydonlarni to'ldiring." });
    }

    try {
        // Yangi Product yaratish
        const createData = new Product({
            pharmacyId, // pharmacyId'ni saqlash
            Nomi, Ishlabchiqarilgan, Muddat, turi, Olingan, Sotiladi, Soni, Donaga, Dona, FindQuti, BarCode, Haqida, FirmaNomi, pulMiqdor, sabab, date,
        });

        // Agar rasm yuklangan bo'lsa, yo'lini saqlash
        if (req.file) {
            createData.Rasm = req.file.path;
        }

        // Ma'lumotlarni saqlash
        const createdPharm = await createData.save();
        res.status(201).json({ success: true, message: "Dori muvaffaqiyatli qo'shildi!", innerData: createdPharm });
    } catch (error) {
        console.error("Xato:", error);
        res.status(500).json({ success: false, message: "Serverda xato yuz berdi." });
    }
};

// Check duplicate product
const checkDuplicate = async (req, res) => {
    const { BarCode } = req.query;
    const { pharmacyId } = req.user;

    try {
        const existingProduct = await Product.findOne({ pharmacyId, BarCode });
        res.json({ exists: !!existingProduct });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server xatosi' });
    }
};

// Delete a product by pharmacyId
const deletePharm = async (req, res) => {
    const { id } = req.params;
    const { pharmacyId } = req.user;

    try {
        const deleted = await Product.findOneAndDelete({ _id: id, pharmacyId });
        res.json({
            success: true,
            message: deleted ? "Dori muvaffaqiyatli o‘chirildi!" : "Dori topilmadi!",
            innerData: deleted
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Update product by pharmacyId
const updatePharm = async (req, res) => {
    const { id } = req.params;
    const updateData = req.body;
    const { pharmacyId } = req.user;

    try {
        const updatedProduct = await Product.findOneAndUpdate({ _id: id, pharmacyId }, updateData, { new: true });
        res.status(200).json({
            success: true,
            message: updatedProduct ? 'Mahsulot yangilandi!' : 'Mahsulot topilmadi!',
            data: updatedProduct
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};



// Create new withdrawal data
const createAllMany = async (req, res) => {
    const { ism, sabab, pulMiqdor, date } = req.body;
    const { pharmacyId } = req.user;

    try {
        const newAllMany = new WithdrawModel({ pharmacyId, ism, sabab, pulMiqdor, date });
        const createdAllMany = await newAllMany.save();
        res.status(201).json({ success: true, message: "Yangi ma'lumot muvaffaqiyatli yaratildi!", data: createdAllMany });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Get all withdrawal data by pharmacyId
const getAllMany = async (req, res) => {
    const { pharmacyId } = req.user;

    try {
        const allMany = await WithdrawModel.find({ pharmacyId });
        res.json({
            success: true,
            message: allMany.length ? "Ma'lumotlar muvaffaqiyatli topildi!" : "Hech qanday ma'lumot topilmadi.",
            innerData: allMany
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Update withdrawal data by pharmacyId
const updateAllMany = async (req, res) => {
    const { id } = req.params;
    const updateData = req.body;
    const { pharmacyId } = req.user;

    try {
        const updatedAllMany = await WithdrawModel.findOneAndUpdate({ _id: id, pharmacyId }, updateData, { new: true });
        res.status(200).json({
            success: true,
            message: updatedAllMany ? 'Ma\'lumot yangilandi!' : 'Ma\'lumot topilmadi!',
            data: updatedAllMany
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};


// Delete withdrawal data by pharmacyId
const deleteAllMany = async (req, res) => {
    const { id } = req.params;
    const { pharmacyId } = req.user;

    try {
        const deletedAllMany = await WithdrawModel.findOneAndDelete({ _id: id, pharmacyId });
        res.json({
            success: true,
            message: deletedAllMany ? 'Ma\'lumot muvaffaqiyatli o‘chirildi!' : 'Ma\'lumot topilmadi!'
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = {
    searchPharm,
    getPharm,
    createPharm,
    deletePharm,
    updatePharm,
    upload,
    checkDuplicate,
    createAllMany,
    updateAllMany,
    getAllMany,
    deleteAllMany
};
