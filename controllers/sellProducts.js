const SoldProduct = require('../model/soldProductSchema');

// Mahsulotni yaratish
const createSoldProduct = async (req, res) => {
    try {
        const { products, pharmacyId } = req.body;

        if (!products || products.length === 0) {
            return res.status(400).json({ success: false, message: "Mahsulotlar yo'q!" });
        }

        const saleEntries = products.map(product => ({
            productId: product._id,
            pharmacyId,
            Nomi: product.Nomi,
            Sotiladi: product.Sotiladi,
            Activ: product.Activ,
            Donaga: product.Donaga,
            Activdona: product.Activdona,
            Card: product.Card,
            saleDate: new Date(product.saleDate),
        }));

        // Ma'lumotlarni bazaga saqlash
        const savedEntries = await SoldProduct.insertMany(saleEntries);
        res.status(200).json({ success: true, message: 'Mahsulotlar sotildi!', data: savedEntries });
    } catch (error) {
        console.error('Mahsulotlarni sotishda xatolik:', error);
        res.status(500).json({ success: false, message: 'Serverda xatolik yuz berdi!' });
    }
};
// const createCard = async (req, res) => {
//     try {
//         const { products, pharmacyId } = req.body;

//         if (!products || products.length === 0) {
//             return res.status(400).json({ success: false, message: "Mahsulotlar yo'q!" });
//         }

//         const saleEntries = products.map(product => ({
//             productId: product._id,
//             pharmacyId,
//             Card: product.Card,
//             saleDate: new Date(product.saleDate),
//         }));

//         // Ma'lumotlarni bazaga saqlash
//         const savedEntries = await SoldProduct.insertMany(saleEntries);
//         res.status(200).json({ success: true, message: 'Mahsulotlar sotildi!', data: savedEntries });
//     } catch (error) {
//         console.error('Mahsulotlarni sotishda xatolik:', error);
//         res.status(500).json({ success: false, message: 'Serverda xatolik yuz berdi!' });
//     }
// };


// Mahsulotlarni olish
const getSoldProducts = async (req, res) => {
    try {
        const pharmacyId = req.params.pharmacyId || req.user?.pharmacyId;

        const soldProducts = await SoldProduct.find({ pharmacyId });
        res.json({ success: true, message: "Sotilgan mahsulotlar topildi!", data: soldProducts });
    } catch (error) {
        console.error('Sotilgan mahsulotlarni olishda xatolik:', error);
        res.status(500).json({ success: false, message: 'Serverda xatolik yuz berdi!' });
    }
};

// Mahsulotni yangilash
const updateSoldProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const { Activ, Activdona } = req.body;
        const { pharmacyId } = req.user;

        let soldProduct = await SoldProduct.findOne({ _id: id, pharmacyId });
        if (!soldProduct) {
            return res.status(404).json({ success: false, message: 'Mahsulot topilmadi!' });
        }

        soldProduct.Activ = Activ !== undefined ? Activ : soldProduct.Activ;
        soldProduct.Activdona = Activdona !== undefined ? Activdona : soldProduct.Activdona;
        await soldProduct.save();

        res.status(200).json({ success: true, message: 'Mahsulot yangilandi!' });
    } catch (error) {
        console.error('Mahsulotni yangilashda xatolik:', error);
        res.status(500).json({ success: false, message: 'Serverda xatolik yuz berdi!' });
    }
};

// Mahsulotni o'chirish
const deleteSoldProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const { pharmacyId } = req.user;

        let soldProduct = await SoldProduct.findOneAndDelete({ _id: id, pharmacyId });
        if (!soldProduct) {
            return res.status(404).json({ success: false, message: 'Mahsulot topilmadi!' });
        }

        res.status(200).json({ success: true, message: 'Mahsulot o\'chirildi!' });
    } catch (error) {
        console.error('Mahsulotni o\'chirishda xatolik:', error);
        res.status(500).json({ success: false, message: 'Serverda xatolik yuz berdi!' });
    }
};

module.exports = {
    createSoldProduct,
    getSoldProducts,
    updateSoldProduct,
    deleteSoldProduct,
    // createCard
};
