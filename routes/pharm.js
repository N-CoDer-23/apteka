const express = require('express');
const router = express.Router();
const {
    searchPharm,
    getPharm,
    createPharm,
    deletePharm,
    updatePharm,
    upload,
    checkDuplicate,
    createAllMany,
    updateAllMany,
    getAllMany,
    deleteAllMany
} = require('../controls/pharm');

// Ma'lumotlarni ko'rish
router.get('/getPharm', getPharm);
// Yangi dori qo'shish
router.post('/createPharm', upload.single('image'), createPharm);
// Dorilarni ID'siga qarab yangilash
router.put('/updatePharm/:id', updatePharm);
// Dorilarni ID'siga qarab o'chirish
router.delete('/deletePharm/:id', deletePharm);
// Dorilarni qidirish
router.get('/searchPharm', searchPharm);
// Dublikatlarni tekshirish
router.get('/checkDuplicate', checkDuplicate);

// Pul olish
// Ma'lumotlarni olish
router.get('/getAllMany', getAllMany);

// Ma'lumotni yaratish
router.post('/createAllMany', createAllMany);

// Ma'lumotni yangilash
router.put('/updateAllMany/:id', updateAllMany);

// Ma'lumotni o'chirish
router.delete('/deleteAllMany/:id', deleteAllMany);

module.exports = router;
