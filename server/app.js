import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import connectDB from "./config/dbConfig.js";
import authRouter from "./routes/authRoute.js";


const app = express();

// DB connection
connectDB();

app.use(express.json()); // built-in middleware
app.use(cookieParser()); // third party middleware

app.use(cors({ origin: [process.env.CLIENT_URL], credentials: true })); // third party middleware


app.use('/api/auth/', authRouter)

app.get("/", (req, res) => {
  res.status(200).json({ data: "JWTAuth server" });
});


export default app;

