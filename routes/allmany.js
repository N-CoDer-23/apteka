const express = require('express');
const router = express.Router();
const { getMany, createMany, updateMany, deleteMany } = require('../controls/many');

// Endpoints
router.get('/getMany', getMany);
router.post('/createMany', createMany);
router.put('/updateMany/:id', updateMany);
router.delete('/deleteMany/:id', deleteMany);

module.exports = router;
