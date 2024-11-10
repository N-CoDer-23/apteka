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
} = require('../controllers/pharm');
const authMiddleware = require('../controllers/auth.middleware');



// Ma'lumotlarni ko'rish
router.get('/getPharm/:pharmacyId', authMiddleware, getPharm);


// Yangi dori qo'shish
router.post('/createPharm', authMiddleware, upload.single('image'), createPharm);
// Dorilarni ID'siga qarab yangilash
router.put('/updatePharm/:id', authMiddleware, updatePharm);
// Dorilarni ID'siga qarab o'chirish
router.delete('/deletePharm/:id', authMiddleware, deletePharm);
// Dorilarni qidirish
router.get('/searchPharm/:id', authMiddleware, searchPharm);
// Dublikatlarni tekshirish
router.get('/checkDuplicate', checkDuplicate);

// Pul olish
// Ma'lumotlarni olish
router.get('/getAllMany/:pharmacyId', authMiddleware, getAllMany);

// Ma'lumotni yaratish
router.post('/createAllMany', authMiddleware, createAllMany);

// Ma'lumotni yangilash
router.put('/updateAllMany/:id', updateAllMany);

// Ma'lumotni o'chirish
router.delete('/deleteAllMany/:id', deleteAllMany);

module.exports = router;
