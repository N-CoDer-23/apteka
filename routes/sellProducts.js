const express = require('express');
const router = express.Router();
const {
  createSoldProduct,
  getSoldProducts,
  updateSoldProduct,
  deleteSoldProduct,
} = require('../controllers/sellProducts');
const authMiddleware = require('../controllers/auth.middleware');

// Yaratish
router.post('/createsell', authMiddleware, createSoldProduct);

// O'qish
router.get('/getsell/:pharmacyId', authMiddleware, getSoldProducts);

// Yangilash
router.put('/updatesell/:id', authMiddleware, updateSoldProduct);

// O'chirish
router.delete('/deletesell/:id', authMiddleware, deleteSoldProduct);

module.exports = router;
