const express = require('express');
const { saveQaytaMany, getAllQaytaMany, getQaytaManyById, deleteQaytaMany } = require('../controllers/qayta');
const router = express.Router();

const authMiddleware = require('../controllers/auth.middleware');

router.get('/getQaytaMany/:id', authMiddleware, getQaytaManyById);    // ID bo'yicha qaytarilgan mahsulotni olish
router.get('/getAllQaytaMany', authMiddleware, getAllQaytaMany);      // Barcha qaytarilgan mahsulotlarni olish
router.post('/saveQaytaMany', authMiddleware, saveQaytaMany);         // Yangi qaytarish ma'lumotlarini saqlash
router.delete('/deleteQaytaMany/:id', authMiddleware, deleteQaytaMany); // Qaytarilgan mahsulotni o'chirish

module.exports = router;
