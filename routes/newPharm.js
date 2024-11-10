const express = require('express');
const router = express.Router();
const {
    createNewPharm,
    getAllNewPharm,
    getOneNewPharm,
    updateNewPharm,
    deleteNewPharm,
  
} = require('../controllers/newPharmC');
const authMiddleware = require('../controllers/auth.middleware');

// 1 ta dorixona ko'rish
router.get('/getOneNewPharm/:id', authMiddleware, getOneNewPharm);
// barcha dorixona ko'rish
router.get('/getAllNewPharm', getAllNewPharm);
// Yangi dorixona qo'shish
router.post('/createNewPharm', createNewPharm);
// Dorixonani ID'siga qarab yangilash
router.put('/updateNewPharm/:id', updateNewPharm);
// Dorixonani ID'siga qarab o'chirish
router.delete('/deleteNewPharm/:id', deleteNewPharm);
// Dorixonani qidirish
// router.get('/searchPharm', searchPharm);




module.exports = router;
