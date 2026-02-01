require("dotenv").config();
const express = require("express");
const path = require("path");
const connectMongoDB = require("./utils/mongoDBConnection");
const app = express();
const PORT = process.env.PORT || 3000;
const router = require('./routes/index');
const cookieParser = require('cookie-parser');
const cors = require('cors');

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(cors({
    origin: ["http://localhost:5173", "http://localhost:4200"],
    credentials: true
}))

// Serve uploaded files statically
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

connectMongoDB();

app.get("/", async (req, res) => {  //Testing Route for server
    res.send("Hello from Server!")
})

app.use('/api', router)


app.listen(PORT, () => console.log(`Server Started At PORT : ${PORT}`));

