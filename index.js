import express from "express";
import { Route } from "./route.js";
import mongoose from "mongoose";
import { CONFIG } from "./config.js";
import envConfig from "dotenv"
envConfig.config()
const app = express();
app.use(express.urlencoded({ extended: false ,limit:"50mb"}));
app.use(express.json({limit:"50mb"}));
mongoose.connect(process.env.MONOGO_URL).then(() => {
    console.log("mongo connected successfully");
});

app.use((req, res, next) => {
    // console.log(req.originalUrl)
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "*");
    res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, DELETE");
    next()
});
app.use('/', Route);

app.listen(process.env.PORT, () => {
    console.log("server listening on " + process.env.PORT);
})