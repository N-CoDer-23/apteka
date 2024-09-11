// routes/soldProducts.js
const express = require('express');
const router = express.Router();
const {
  createSoldProduct,
  getSoldProducts,
  updateSoldProduct,
  deleteSoldProduct,
} = require('../controls/sellProducts');

// Yaratish
router.post('/createsell', createSoldProduct);

// O'qish
router.get('/getsell', getSoldProducts);

// Yangilash
router.put('/updatesell/:id', updateSoldProduct);

// O'chirish
router.delete('/deletesell/:id', deleteSoldProduct);

module.exports = router;
