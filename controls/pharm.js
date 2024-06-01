const Product = require('../model/pharmacySchema');
const multer = require('multer');

// ------Qidirish----------
const searchPharm = async (req, res) => {
    const { query } = req.query;

    try {
        const pharms = await Product.find({
            $or: [
                { Nomi: { $regex: query, $options: 'i' } },
                { Haqida: { $regex: query, $options: 'i' } }
            ]
        });

        if (pharms.length === 0) {
            return res.json({
                success: false,
                message: "Qidiruvga mos dorixonalar topilmadi.",
                innerData: []
            });
        }

        res.json({
            success: true,
            message: "Dorixonalar muvaffaqiyatli topildi!",
            innerData: pharms
        });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
}

// ---------Dorixonalarni olish----------
const getPharm = async (req, res) => {
    try {
        let allpharms = await Product.find();
        if (allpharms.length === 0) {
            return res.json({
                success: false,
                message: "Dorixonalar topilmadi!",
                innerData: allpharms
            });
        }
        res.json({
            success: true,
            message: "Dorixonalar topildi!",
            innerData: allpharms
        });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
}

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    }
});

const upload = multer({ storage: storage });

// ------Dorixona yaratish------------
const createPharm = async (req, res) => {
    try {
        const {
            Nomi,
            Ishlabchiqarilgan,
            Muddat,
            Olingan,
            Sotiladi,
            Haqida,
            FirmaNomi
        } = req.body;

        // Ma'lumotlar to'liq taqdim etilganini tekshirish
        if (!Nomi || !Ishlabchiqarilgan || !Muddat || !Olingan || !Sotiladi || !Haqida || !FirmaNomi) {
            return res.status(400).json({
                success: false,
                message: "Barcha majburiy maydonlarni to'ldiring."
            });
        }

        const createData = new Product({
            Nomi,
            Ishlabchiqarilgan,
            Muddat,
            Olingan,
            Sotiladi,
            Rasm: req.file ? req.file.path : '',
            Haqida,
            FirmaNomi
        });

        const createdPharm = await createData.save();
        res.json({
            success: true,
            message: "Dorixona muvaffaqiyatli yaratildi!",
            innerData: createdPharm
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}

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
        let { id } = req.params;
        let body = req.body;

        if (!id) {
            return res.status(400).json({
                success: false,
                message: "ID taqdim etilmagan."
            });
        }

        let updated = await Product.findByIdAndUpdate(id, body, { new: true });
        if (!updated) {
            return res.status(404).json({
                success: false,
                message: "Dorixona yangilanmadi!",
                innerData: updated
            });
        }
        res.json({
            success: true,
            message: "Dorixona muvaffaqiyatli yangilandi!",
            innerData: updated
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}

module.exports = {
    updatePharm,
    getPharm,
    createPharm,
    deletePharm,
    searchPharm,
    upload,
}
