const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(express.json());
app.use(cors());

async function connectToDB() {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("MongoDB is connected");
  } catch (err) {
    console.log("MongoDB connection error:", err);
  }
}
connectToDB();

app.get('/', (req, res) => {
  res.json("Hi NodeJs!");
});

const usersRouter = require('./routes/user');
const pharmRouter = require('./routes/pharm');
const manyRouter = require('./routes/allmany');
const soldRouter = require('./routes/sellProducts');

app.use('/users', usersRouter);
app.use('/pharm', pharmRouter);
app.use('/many', manyRouter);
app.use('/sel', soldRouter);

const PORT = process.env.PORT || 7000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
