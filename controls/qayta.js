const QaytaMany = require('../model/Qayta');

// Qaytarish ma'lumotlarini saqlash
const saveQaytaMany = async (req, res) => {
    try {
        const { transactions } = req.body;

        for (let transaction of transactions) {
            const createData = new QaytaMany({
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
        const qaytarilganlar = await QaytaMany.find().populate('productId');

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
        const qaytaMany = await QaytaMany.findById(req.params.id).populate('productId');

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
        const qaytaMany = await QaytaMany.findByIdAndDelete(req.params.id);

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
