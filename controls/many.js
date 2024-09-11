const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Mongoose modeli uchun schema yaratish
const manySchema = new Schema({
    amount: { type: Number, required: true },
});

const AlMany = mongoose.model('AlMany', manySchema);

// Barcha ma'lumotlarni olish funksiyasi
const getMany = async (req, res) => {
    try {
        console.log("Ma'lumotlarni olish boshlandi...");

        const amount = await AlMany.find();
        console.log("Olingan ma'lumotlar:", amount);

        if (!amount || amount.length === 0) {
            return res.status(404).json({ success: false, message: "Ma'lumot topilmadi." });
        }

        res.status(200).json({ success: true, message: "Ma'lumotlar topildi!", innerData: amount });
    } catch (error) {
        console.error('Ma\'lumotlarni olishda xatolik:', error);
        res.status(500).json({ success: false, message: 'Serverda xatolik yuz berdi!' });
    }
};

// Yangi ma'lumot yaratish funksiyasi
const createMany = async (req, res) => {
    try {
        console.log("Kelgan ma'lumotlar:", req.body);

        const { amount } = req.body;

        if (!amount || typeof amount !== 'number') {
            return res.status(400).json({ success: false, message: "To'g'ri miqdorni kiriting." });
        }

        const newAlMany = new AlMany({ amount });
        console.log("Yangi ma'lumot:", newAlMany); // Saqlashdan oldin yangi obyektni konsolga chiqarish
        const savedAlMany = await newAlMany.save();

        res.status(201).json({ success: true, message: "Ma'lumot muvaffaqiyatli yaratildi!", innerData: savedAlMany });
    } catch (error) {
        console.error('Ma\'lumot yaratishda xatolik:', error.message);
        res.status(500).json({ success: false, message: 'Serverda xatolik yuz berdi!' });
    }
};

// Ma'lumotni yangilash funksiyasi
const updateMany = async (req, res) => {
    try {
        const { id } = req.params;
        const { amount } = req.body;

        const updatedAlMany = await AlMany.findByIdAndUpdate(id, { amount }, { new: true });

        if (!updatedAlMany) {
            return res.status(404).json({ success: false, message: "Ma'lumot topilmadi!" });
        }

        res.status(200).json({ success: true, message: "Ma'lumot yangilandi!", innerData: updatedAlMany });
    } catch (error) {
        console.error('Ma\'lumotni yangilashda xatolik:', error.message);
        res.status(500).json({ success: false, message: 'Serverda xatolik yuz berdi!' });
    }
};

// Ma'lumotni o'chirish funksiyasi
const deleteMany = async (req, res) => {
    try {
        const { id } = req.params;

        const deletedAlMany = await AlMany.findByIdAndDelete(id);

        if (!deletedAlMany) {
            return res.status(404).json({ success: false, message: "Ma'lumot topilmadi!" });
        }

        res.status(200).json({ success: true, message: "Ma'lumot muvaffaqiyatli o‘chirildi!", innerData: deletedAlMany });
    } catch (error) {
        console.error('Ma\'lumotni o\'chirishda xatolik:', error.message);
        res.status(500).json({ success: false, message: 'Serverda xatolik yuz berdi!' });
    }
};

// Funksiyalarni eksport qilish
module.exports = {
    getMany,
    createMany,
    updateMany,
    deleteMany
};
