const {Router} = require('express')

const users = Router();

const{getUser, login, createUser,deleteUser,updateUser} = require('../controls/login')

// ishchilarni royxatini korish
users.get('/getUser', getUser);
// Royxatdan otish va tekshirish
users.post('/postLogin', login);
// Yangi ishchi qoshish
users.post('/createUser', createUser);
// Ishchilarni id si boyicha ochirish
users.delete('/deleteUser/:_id', deleteUser);
// Ishchilarni id si boyicha yangilash
users.put('/updateUser/:_id', updateUser);


module.exports = {users};