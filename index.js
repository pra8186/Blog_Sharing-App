import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import blogRouter from "./routes/BlogRoutes.js";
import schedule from 'node-schedule';
import {resetLast24hClickCounts} from "./controllers/BlogController.js";
import adminRouter from "./routes/AdminRoutes.js";

dotenv.config()

const app = express()
app.use(cors())
app.use(express.json())
app.use('/api/blogs', blogRouter)
app.use('/api/admin', adminRouter)

schedule.scheduleJob('0 0 * * *', async () => {
    try {
        await resetLast24hClickCounts()
            .then(() => console.log('24h click count reset successful'))
            .catch((e) => console.error(e))
    } catch (e) {
        console.error(e)
    }
})

mongoose
    .connect(
        process.env.mongo_link,
        {useNewUrlParser: true, useUnifiedTopology: true}
    )
    .then(() => app.listen(process.env.PORT))
    .then(() =>
        console.log(`CONNECTED TO PORT ${process.env.PORT}`)
    )
    .catch((err) => console.log(err));