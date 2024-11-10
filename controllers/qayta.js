const QaytaMany = require('../model/Qayta');

// Qaytarish ma'lumotlarini saqlash
const saveQaytaMany = async (req, res) => {
    try {
        const { transactions } = req.body;
        const { pharmacyId } = req.user; // Foydalanuvchi dorixonasining ID sini olish

        for (let transaction of transactions) {
            const createData = new QaytaMany({
                pharmacyId,
                qaytarilganNomi: transaction.qaytarilganNomi,
                qaytarilganDona: transaction.qaytarilganDona,
                qaytarilganNarxi: transaction.qaytarilganNarxi,
                qaytarilganQuti: transaction.qaytarilganQuti,
                qaytarishVaqti: transaction.qaytarishVaqti,
            });

            await createData.save();
        }

        res.status(201).json({ success: true, message: "Qaytarish muvaffaqiyatli saqlandi!" });
    } catch (error) {
        console.error('Serverda xatolik:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// Barcha qaytarilgan mahsulotlarni olish
const getAllQaytaMany = async (req, res) => {
    try {
        const { pharmacyId } = req.user;
        const qaytarilganlar = await QaytaMany.find({ pharmacyId }).populate('productId');

        res.status(200).json({
            success: true,
            data: qaytarilganlar,
        });
    } catch (error) {
        console.error('Qaytarilgan mahsulotlarni olishda xato:', error);
        res.status(500).json({
            success: false,
            message: 'Qaytarilgan mahsulotlarni olishda xato',
            error: error.message,
        });
    }
};

// ID bo'yicha qaytarilgan mahsulotni olish
const getQaytaManyById = async (req, res) => {
    try {
        const { pharmacyId } = req.user;
        const qaytaMany = await QaytaMany.findOne({ pharmacyId, _id: req.params.id }).populate('productId');

        if (!qaytaMany) {
            return res.status(404).json({
                success: false,
                message: 'Qaytarilgan mahsulot topilmadi',
            });
        }

        res.status(200).json({
            success: true,
            data: qaytaMany,
        });
    } catch (error) {
        console.error('Qaytarilgan mahsulotni olishda xato:', error);
        res.status(500).json({
            success: false,
            message: 'Qaytarilgan mahsulotni olishda xato',
            error: error.message,
        });
    }
};

// ID bo'yicha qaytarilgan mahsulotni o'chirish
const deleteQaytaMany = async (req, res) => {
    try {
        const { pharmacyId } = req.user;
        const qaytaMany = await QaytaMany.findOneAndDelete({ _id: req.params.id, pharmacyId });

        if (!qaytaMany) {
            return res.status(404).json({
                success: false,
                message: 'Qaytarilgan mahsulot topilmadi',
            });
        }

        res.status(200).json({
            success: true,
            message: 'Qaytarilgan mahsulot o\'chirildi',
        });
    } catch (error) {
        console.error('Qaytarilgan mahsulotni o\'chirishda xato:', error);
        res.status(500).json({
            success: false,
            message: 'Qaytarilgan mahsulotni o\'chirishda xato',
            error: error.message,
        });
    }
};

module.exports = {
    saveQaytaMany,
    getAllQaytaMany,
    getQaytaManyById,
    deleteQaytaMany,
};
