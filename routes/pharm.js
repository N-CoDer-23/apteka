const { Router } = require('express');

const pharm = Router();
const {
    getPharm,
    createPharm,
    updatePharm,
    deletePharm,
    searchPharm,
    upload
} = require('../controls/pharm')

// Ma'lumotlarni ko'rish
pharm.get('/getPharm', getPharm);
// Yangi dori qo'shish
pharm.post('/createPharm', upload.single("image"), createPharm);
// Dorilarni ID'siga qarab yangilash
pharm.put('/updatePharm/:id', updatePharm);
// Dorilarni ID'siga qarab o'chirish
pharm.delete('/deletePharm/:id', deletePharm);
// Dorilarni qidirish
pharm.get('/searchPharm', searchPharm);

module.exports = pharm;
