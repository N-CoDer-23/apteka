require('dotenv').config();
const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
    const authHeader = req.headers.authorization;
    console.log(authHeader);
    
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ success: false, message: "Avtorizatsiya tokeni yo'q yoki noto'g'ri formatda." });
    }

    const token = authHeader.split(' ')[1];
    
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY); // JWT_SECRET ni ishlatish
        req.user = decoded;
        next();
    } catch (error) {
        console.error("Tokenni tasdiqlashda xatolik:", error.message);
        res.status(401).json({ success: false, message: "Token yaroqsiz yoki tasdiqlanmadi." });
    }
    console.log("JWT_SECRET:", process.env.JWT_SECRET_KEY);

};

module.exports = authMiddleware;
