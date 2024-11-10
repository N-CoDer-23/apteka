const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Mongoose modeli uchun schema yaratish
const manySchema = new Schema({
    amount: { type: Number, required: true },
    pharmacyId: { type: Schema.Types.ObjectId, ref: 'Pharmacy', required: true } // dorixona IDsi bilan bog'lash
});

const AlMany = mongoose.model('AlMany', manySchema);

// Barcha ma'lumotlarni dorixona ID orqali olish funksiyasi
const getMany = async (req, res) => {
    try {
        const { pharmacyId } = req.params; // URL orqali dorixona IDsi keladi

        console.log("Ma'lumotlarni olish boshlandi...");
        const amount = await AlMany.find({ pharmacyId }); // Faqat tegishli dorixonaga oid ma'lumotlarni olish
        console.log("Olingan ma'lumotlar:", amount);

        if (!amount || amount.length === 0) {
            return res.status(404).json({ success: false, message: "Ma'lumot topilmadi." });
        }

        res.status(200).json({ success: true, message: "Ma'lumotlar topildi!", innerData: amount });
    } catch (error) {
        console.error("Ma'lumotlarni olishda xatolik:", error);
        res.status(500).json({ success: false, message: "Serverda xatolik yuz berdi!" });
    }
};

// Yangi ma'lumot yaratish funksiyasi
const createMany = async (req, res) => {
    try {
        const { pharmacyId, amount } = req.body;

        if (!pharmacyId || !amount || typeof amount !== 'number') {
            return res.status(400).json({ success: false, message: "To'g'ri miqdorni va dorixona IDni kiriting." });
        }

        const newAlMany = new AlMany({ pharmacyId, amount });
        console.log("Yangi ma'lumot:", newAlMany);
        const savedAlMany = await newAlMany.save();
            
        res.status(201).json({ success: true, message: "Ma'lumot muvaffaqiyatli yaratildi!", innerData: savedAlMany });
    } catch (error) {
        console.error("Ma'lumot yaratishda xatolik:", error.message);
        res.status(500).json({ success: false, message: "Serverda xatolik yuz berdi!" });
    }
};

// Ma'lumotni dorixona ID orqali yangilash funksiyasi
const updateMany = async (req, res) => {
    try {
        const { id, pharmacyId } = req.params; // Dorixona ID va ma'lumot IDsi URL orqali keladi
        const { amount } = req.body;

        const updatedAlMany = await AlMany.findOneAndUpdate(
            { _id: id, pharmacyId }, // Tegishli dorixonani va yozuvni aniqlash
            { amount },
            { new: true }
        );

        if (!updatedAlMany) {
            return res.status(404).json({ success: false, message: "Ma'lumot topilmadi!" });
        }

        res.status(200).json({ success: true, message: "Ma'lumot yangilandi!", innerData: updatedAlMany });
    } catch (error) {
        console.error("Ma'lumotni yangilashda xatolik:", error.message);
        res.status(500).json({ success: false, message: "Serverda xatolik yuz berdi!" });
    }
};

// Ma'lumotni dorixona ID orqali o'chirish funksiyasi
const deleteMany = async (req, res) => {
    try {
        const { id, pharmacyId } = req.params;

        const deletedAlMany = await AlMany.findOneAndDelete({ _id: id, pharmacyId });

        if (!deletedAlMany) {
            return res.status(404).json({ success: false, message: "Ma'lumot topilmadi!" });
        }

        res.status(200).json({ success: true, message: "Ma'lumot muvaffaqiyatli o‘chirildi!", innerData: deletedAlMany });
    } catch (error) {
        console.error("Ma'lumotni o'chirishda xatolik:", error.message);
        res.status(500).json({ success: false, message: "Serverda xatolik yuz berdi!" });
    }
};

// Funksiyalarni eksport qilish
module.exports = {
    getMany,
    createMany,
    updateMany,
    deleteMany
};
