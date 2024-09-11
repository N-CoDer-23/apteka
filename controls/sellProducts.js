const SoldProduct = require('../model/soldProductSchema');
const Product = require('../model/pharmacySchema'); // Product modelini import qilish

const createSoldProduct = async (req, res) => {
    try {
        const { products } = req.body;

        for (const product of products) {
            const { _id, Nomi, Activdona, Sotiladi, Activ, Donaga, saleDate } = product;

            // Sold productni topish yoki yangi sold product yaratish
            let soldProduct = await SoldProduct.findOne({ productId: _id, saleDate });

            if (!soldProduct) {
                soldProduct = new SoldProduct({
                    productId: _id,
                    Nomi,
                    Sotiladi,
                    Activ,
                    Donaga,
                    Activdona,
                    saleDate,
                });
            } else {
                // Mavjud sold productni yangilash
                soldProduct.Activ = parseFloat(soldProduct.Activ) + parseFloat(Activ);
                soldProduct.Activdona = parseFloat(soldProduct.Activdona) + parseFloat(Activdona);
            }

            await soldProduct.save();
        }

        res.status(200).json({ success: true, message: 'Mahsulotlar sotildi!' });
    } catch (error) {
        console.error('Mahsulotlarni sotishda xatolik:', error);
        res.status(500).json({ success: false, message: 'Serverda xatolik yuz berdi!' });
    }
};

const getSoldProducts = async (req, res) => {
    try {
        let soldProducts = await SoldProduct.find(); // Query SoldProduct instead of Product
        if (soldProducts.length === 0) {
            return res.json({
                success: false,
                message: "Sotilgan mahsulotlar topilmadi!",
                innerData: soldProducts
            });
        }
        res.json({
            success: true,
            message: "Sotilgan mahsulotlar topildi!",
            innerData: soldProducts
        });
    } catch (error) {
        console.error('Sotilgan mahsulotlarni olishda xatolik:', error);
        res.status(500).json({ success: false, message: 'Serverda xatolik yuz berdi!' });
    }
};

const updateSoldProduct = async (req, res) => {
    try {
        const { id } = req.params; // Sotilgan mahsulot IDsi URL orqali keladi
        const { Activ, Activdona } = req.body; // Yangilanishi kerak bo'lgan qiymatlar

        let soldProduct = await SoldProduct.findById(id);
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

const deleteSoldProduct = async (req, res) => {
    try {
        const { id } = req.params; // Sotilgan mahsulot IDsi URL orqali keladi

        let soldProduct = await SoldProduct.findByIdAndDelete(id);
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
};
