const express = require('express');
const { saveQaytaMany, getAllQaytaMany, getQaytaManyById, deleteQaytaMany } = require('../controls/qayta');
const router = express.Router();

router.post('/saveQaytaMany', saveQaytaMany);         // Yangi qaytarish ma'lumotlarini saqlash
router.get('/getAllQaytaMany', getAllQaytaMany);      // Barcha qaytarilgan mahsulotlarni olish
router.get('/getQaytaMany/:id', getQaytaManyById);    // ID bo'yicha qaytarilgan mahsulotni olish
router.delete('/deleteQaytaMany/:id', deleteQaytaMany); // Qaytarilgan mahsulotni o'chirish

module.exports = router;
