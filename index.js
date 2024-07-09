const express = require("express");
const { connect } = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(express.json());
app.use(cors());

async function connectToDB() {
    await connect(process.env.MONGO_URI)
        .then(() => console.log("MongoDb is connected"))
        .catch((err) => console.log("MongoDB is not connected", err));
}
connectToDB();

app.get('/', (req, res) => {
    res.json("Hi NodeJs!");
});

const usersRouter = require('./routes/user');
const pharmRouter = require('./routes/pharm');

app.use('/users', usersRouter);
app.use('/pharm', pharmRouter);

const PORT = process.env.PORT || 7000;
app.listen(PORT, () => {
    console.log(`Server http://localhost:${PORT} portda ishga tushdi`);
});
