const express = require('express');
const router = express.Router();
const Pharmacy = require('../model/newPharm'); // dorixona modelini import qilish
const bcrypt = require('bcrypt');

// Yangi dorixona qo'shish (Create)
const createNewPharm = async (req, res) => {
    try {
        const { pharmacyName, location, contactNumber, ownerName, username, password, type } = req.body;

        // Parolni hash qilish
        const hashedPassword = await bcrypt.hash(password, 10);

        // Hash qilingan parol bilan yangi dorixona yaratish
        const newPharmacy = new Pharmacy({
            pharmacyName,
            location,
            contactNumber,
            ownerName,
            username,
            password: hashedPassword,
            type,
        });

        await newPharmacy.save();
        res.status(201).json({ 
            success: true, 
            message: "Dorixona muvaffaqiyatli qo'shildi!", 
            data: newPharmacy 
        });
    } catch (error) {
        res.status(400).json({ 
            success: false, 
            message: 'Dorixonani qo‘shishda xatolik', 
            error: error.message 
        });
    }
};

// Barcha dorixonalarni olish (Read all)
const getAllNewPharm = async (req, res) => {
    try {
        const pharmacies = await Pharmacy.find();
        res.status(200).json({ 
            success: true, 
            data: pharmacies 
        });
    } catch (error) {
        res.status(500).json({ 
            success: false, 
            message: 'Dorixonalarni olishda xatolik', 
            error: error.message 
        });
    }
};

// ID bo‘yicha bitta dorixonani olish (Read one)
const getOneNewPharm = async (req, res) => {
    try {
        const pharmacy = await Pharmacy.findById(req.params.id);
        if (!pharmacy) {
            return res.status(404).json({ 
                success: false, 
                message: 'Dorixona topilmadi' 
            });
        }
        res.status(200).json({ 
            success: true, 
            data: pharmacy 
        });
    } catch (error) {
        res.status(500).json({ 
            success: false, 
            message: 'Dorixona ma‘lumotini olishda xatolik', 
            error: error.message 
        });
    }
};

// Dorixonani yangilash (Update)
const updateNewPharm = async (req, res) => {
    try {
        const { pharmacyName, location, contactNumber, ownerName, username, password, type } = req.body;
        
        // Agar yangi parol yuborilgan bo'lsa, uni hash qilish
        const updateData = { pharmacyName, location, contactNumber, ownerName, username, type };
        if (password) {
            updateData.password = await bcrypt.hash(password, 10);
        }

        const pharmacy = await Pharmacy.findByIdAndUpdate(req.params.id, updateData, { new: true, runValidators: true });
        if (!pharmacy) {
            return res.status(404).json({ 
                success: false, 
                message: 'Dorixona topilmadi' 
            });
        }
        
        res.status(200).json({ 
            success: true, 
            message: "Dorixona muvaffaqiyatli yangilandi!", 
            data: pharmacy 
        });
    } catch (error) {
        res.status(400).json({ 
            success: false, 
            message: 'Dorixonani yangilashda xatolik', 
            error: error.message 
        });
    }
};

// Dorixonani o'chirish (Delete)
const deleteNewPharm = async (req, res) => {
    try {
        const pharmacy = await Pharmacy.findByIdAndDelete(req.params.id);
        if (!pharmacy) {
            return res.status(404).json({ 
                success: false, 
                message: 'Dorixona topilmadi' 
            });
        }
        res.status(200).json({ 
            success: true, 
            message: 'Dorixona muvaffaqiyatli o‘chirildi' 
        });
    } catch (error) {
        res.status(500).json({ 
            success: false, 
            message: 'Dorixonani o‘chirishda xatolik', 
            error: error.message 
        });
    }
};

// Eksport qilish
module.exports = {
    createNewPharm,
    getAllNewPharm,
    getOneNewPharm,
    updateNewPharm,
    deleteNewPharm,
};
