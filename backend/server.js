require('dotenv').config();
const express = require('express');
const fs = require("fs");
const port = process.env.PORT || 5000;
const app = express();
const cors = require('cors');
const connectdb = require("./config/mongoDB");
const authRoutes = require("./routes/admin");
const documentRoutes = require("./routes/documentRoutes");
const uploadDir = "./uploads";

connectdb();


app.use(cors({ origin: "*" }));
app.use(express.json());
app.use("/uploads", express.static("uploads"));

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
  console.log("Created uploads folder");
}

app.use("/", authRoutes);
app.use("/api/requests", documentRoutes);

app.listen(port,()=>{
    console.log("Server started at ",port);
})
