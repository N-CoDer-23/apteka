const express = require('express');
const router = express.Router();
const { getMany, createMany, updateMany, deleteMany } = require('../controllers/many');
const authMiddleware = require('../controllers/auth.middleware');


// Endpoints
router.get('/getMany/:pharmacyId', authMiddleware, getMany);
router.post('/createMany', authMiddleware, createMany);
router.put('/updateMany/:id', updateMany);
router.delete('/deleteMany/:id', deleteMany);

module.exports = router;
