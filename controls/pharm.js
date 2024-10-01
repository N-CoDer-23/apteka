const Product = require('../model/pharmacySchema');
const SoldProduct = require('../model/soldProductSchema');
const multer = require('multer');
const path = require('path');
const WithdrawModel = require('../model/AllManyModel');
const axios = require('axios'); // axiosni qo'shish

// Rasmni saqlash konfiguratsiyasi
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    }
});

const upload = multer({ storage: storage });

// ------Qidirish----------
const searchPharm = async (req, res) => {
    const { query } = req.query;

    try {
        const pharms = await Product.find({
            $or: [
                { Nomi: { $regex: query, $options: 'i' } },
                { Haqida: { $regex: query, $options: 'i' } },
                { BarCode: { $regex: query, $options: 'i' } }
            ]
        });

        if (pharms.length === 0) {
            return res.json({
                success: false,
                message: "Qidiruvga mos dorilar topilmadi.",
                innerData: []
            });
        }

        res.json({
            success: true,
            message: "Dorilar muvaffaqiyatli topildi!",
            innerData: pharms
        });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
}

// ---------Dorilarni olish----------
const getPharm = async (req, res) => {
    try {
        let allpharms = await Product.find();
        if (allpharms.length === 0) {
            return res.json({
                success: false,
                message: "Dorilar topilmadi!",
                innerData: allpharms
            });
        }
        res.json({
            success: true,
            message: "Dorilar topildi!",
            innerData: allpharms
        });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
}

// Mahsulot yaratish funksiyasi
const createPharm = async (req, res) => {
    try {
        const { Nomi, Ishlabchiqarilgan, Muddat, turi, Olingan, Sotiladi, Soni, Donaga, Dona, BarCode, Haqida, FirmaNomi, pulMiqdor, sabab, date, 
            
         } = req.body;

        if (!Nomi || !Ishlabchiqarilgan || !Muddat || !turi || !Olingan || !Sotiladi || !Soni || !Donaga || !Dona || !BarCode || !Haqida || !FirmaNomi) {
            return res.status(400).json({ success: false, message: "Barcha majburiy maydonlarni to'ldiring." });
        }

        const createData = new Product({ Nomi, Ishlabchiqarilgan, Muddat, turi, Olingan, Sotiladi, Soni, Donaga, Dona, BarCode, Haqida, FirmaNomi, pulMiqdor, sabab, date, 
            
         });

        if (req.file) {
            createData.Rasm = req.file.path;
        }

        const createdPharm = await createData.save();
        res.status(201).json({ success: true, message: "Dori muvaffaqiyatli qo'shildi!", innerData: createdPharm });
    } catch (error) {
        console.error('Serverda xatolik:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};

const checkDuplicate = async (req, res) => {
    const { BarCode } = req.query;
    try {
        const existingProduct = await Product.findOne({ BarCode });
        res.json({ exists: !!existingProduct });
    } catch (error) {
        res.status(500).json({ message: 'Server xatosi' });
    }
};

// ------Dorixonani o'chirish----------
const deletePharm = async (req, res) => {
    try {
        let { id } = req.params;

        if (!id) {
            return res.status(400).json({
                success: false,
                message: "ID taqdim etilmagan."
            });
        }

        let deleted = await Product.findByIdAndDelete(id);
        if (!deleted) {
            return res.status(404).json({
                success: false,
                message: "Dorixona topilmadi!",
                innerData: deleted
            });
        }
        res.json({
            success: true,
            message: "Dorixona muvaffaqiyatli o‘chirildi!",
            innerData: deleted
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}

// ------Dorixonani yangilash----------
const updatePharm = async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = req.body;

        // Product modelida yangilanishdan oldin validatsiya
        if (!id || !updateData) {
            return res.status(400).json({ success: false, message: 'Iltimos, barcha ma\'lumotlarni to\'ldiring!' });
        }

        // Mahsulotni yangilash
        const updatedProduct = await Product.findByIdAndUpdate(id, updateData, { new: true });

        // Mahsulot mavjudligini tekshirish
        if (!updatedProduct) {
            return res.status(404).json({ success: false, message: 'Mahsulot topilmadi!' });
        }

        res.status(200).json({ success: true, message: 'Mahsulot yangilandi!', data: updatedProduct });
    } catch (error) {
        console.error('Mahsulotni yangilashda xatolik:', error);
        res.status(500).json({ success: false, message: 'Serverda xatolik yuz berdi!' });
    }
};

const getAllMany = async (req, res) => {
    try {
        const allMany = await WithdrawModel.find();

        if (allMany.length === 0) {
            return res.json({
                success: false,
                message: "Hech qanday ma'lumot topilmadi.",
                innerData: []
            });
        }

        res.json({
            success: true,
            message: "Ma'lumotlar muvaffaqiyatli topildi!",
            innerData: allMany
        });
    } catch (error) {
        console.error('Ma\'lumotlarni olishda xatolik:', error);
        res.status(500).json({ success: false, message: 'Serverda xatolik yuz berdi!' });
    }
};

const updateAllMany = async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = req.body;

        const updatedAllMany = await WithdrawModel.findByIdAndUpdate(id, updateData, { new: true });

        if (!updatedAllMany) {
            return res.status(404).json({ success: false, message: 'Ma\'lumot topilmadi!' });
        }

        res.status(200).json({ success: true, message: 'Ma\'lumot yangilandi!', data: updatedAllMany });
    } catch (error) {
        console.error('Ma\'lumotni yangilashda xatolik:', error);
        res.status(500).json({ success: false, message: 'Serverda xatolik yuz berdi!' });
    }
};

const createAllMany = async (req, res) => {
    try {
        const { ism, sabab, pulMiqdor, date } = req.body;

        const newAllMany = new WithdrawModel({ ism, sabab, pulMiqdor, date });
        const createdAllMany = await newAllMany.save();

        res.status(201).json({ success: true, message: 'Yangi ma\'lumot muvaffaqiyatli yaratildi!', data: createdAllMany });
    } catch (error) {
        console.error('Ma\'lumot yaratishda xatolik:', error);
        res.status(500).json({ success: false, message: 'Serverda xatolik yuz berdi!' });
    }
};

const deleteAllMany = async (req, res) => {
    try {
        const { id } = req.params;

        const deletedAllMany = await WithdrawModel.findByIdAndDelete(id);

        if (!deletedAllMany) {
            return res.status(404).json({ success: false, message: 'Ma\'lumot topilmadi!' });
        }

        res.json({ success: true, message: 'Ma\'lumot muvaffaqiyatli o‘chirildi!' });
    } catch (error) {
        console.error('Ma\'lumotni o\'chirishda xatolik:', error);
        res.status(500).json({ success: false, message: 'Serverda xatolik yuz berdi!' });
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
