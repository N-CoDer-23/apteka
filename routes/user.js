const { Router } = require('express');
const { getUser, login, createUser, getPharmacyName, updateUser, deleteUser } = require('../controls/login');

const usersRouter = Router();

usersRouter.get('/getUser', getUser);
usersRouter.post('/login', login); // Corrected path
usersRouter.post('/createUser', createUser);
usersRouter.put('/updateUser/:id', updateUser);
usersRouter.delete('/deleteUser/:id', deleteUser);

usersRouter.get('/getPharm', getPharmacyName);

module.exports = usersRouter;
