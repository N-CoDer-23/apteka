const { Router } = require('express');
const { getUser, login, createUser, updateUser, deleteUser } = require('../controls/login');

const usersRouter = Router();

usersRouter.get('/getUser', getUser);
usersRouter.post('/postLogin', login);
usersRouter.post('/createUser', createUser);
usersRouter.put('/updateUser/:id', updateUser);
usersRouter.delete('/deleteUser/:id', deleteUser);

module.exports = usersRouter;
