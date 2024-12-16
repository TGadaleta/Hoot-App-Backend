import dotenv from "dotenv";
dotenv.config();
import cors from "cors";
import express from "express";
const app = express();
import mongoose from "mongoose";
import testJWTRouter from "./controllers/test-jwt.js";
import usersRouter from "./controllers/users.js";
import profilesRouter from "./controllers/profiles.js";
import hootsRouter from "./controllers/hoots.js";

mongoose.connect(process.env.MONGODB_URI);

mongoose.connection.on("connected", () => {
  console.log(`Connected to MongoDB ${mongoose.connection.name}.`);
});
app.use(cors());
app.use(express.json());

// Routes go here
app.use("/test-jwt", testJWTRouter);
app.use("/users", usersRouter);
app.use("/profiles", profilesRouter);
app.use("/hoots", hootsRouter);

app.listen(3000, () => {
  console.log("The express app is ready!");
});
