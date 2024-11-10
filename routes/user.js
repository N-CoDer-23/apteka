// const { Router } = require('express');
// const { createUser, getUsers, getUserById, updateUser, deleteUser } = require('../controllers/login');

// const usersRouter = Router();

const express = require('express');
const router = express.Router();
const { createUser, getUsers, getUserById, updateUser, deleteUser, login } = require('../controllers/login');
const authMiddleware = require('../controllers/auth.middleware');

// Foydalanuvchi yaratish
router.post('/createUser', authMiddleware, createUser);

// Foydalanuvchilarni olish
router.get('/getUser', authMiddleware, getUsers);

// Bitta foydalanuvchini olish
router.get('/getUserId/:id', authMiddleware, getUserById);

// Foydalanuvchini yangilash
router.put('/updateUser/:id', authMiddleware, updateUser);

// Foydalanuvchini o'chirish
router.delete('/deleteUser/:id', authMiddleware, deleteUser);

router.post('/login', login); // Corrected path

module.exports = router;


// usersRouter.get('/getUser', getUser);
// usersRouter.post('/login', login); // Corrected path
// usersRouter.post('/createUser', createUser);
// usersRouter.put('/updateUser/:id', updateUser);
// usersRouter.delete('/deleteUser/:id', deleteUser);

// usersRouter.get('/getPharm', getPharmacyName);

