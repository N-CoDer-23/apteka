const { Router } = require('express');
const {
    getPharm,
    createPharm,
    updatePharm,
    deletePharm,
    searchPharm,
    upload
} = require('../controls/pharm');

const pharmRouter = Router();

// Ma'lumotlarni ko'rish
pharmRouter.get('/getPharm', getPharm);
// Yangi dori qo'shish
pharmRouter.post('/createPharm', upload.single("image"), createPharm);
// Dorilarni ID'siga qarab yangilash
pharmRouter.put('/updatePharm/:id', updatePharm);
// Dorilarni ID'siga qarab o'chirish
pharmRouter.delete('/deletePharm/:id', deletePharm);
// Dorilarni qidirish
pharmRouter.get('/searchPharm', searchPharm);

module.exports = pharmRouter;
