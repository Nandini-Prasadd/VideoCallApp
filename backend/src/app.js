import dotenv from "dotenv";
dotenv.config();

import express from "express";
import { createServer } from "node:http";
import { Server } from "socket.io";
import mongoose from "mongoose";
import cors from "cors";
import { create } from "node:domain";
import { connectToSocket } from "./controllers/socketManager.js";
import userRoutes from "./routes/usersroute.js";

const app = express();

const server = createServer(app);
const io = connectToSocket(server);

app.set("port", process.env.PORT || 8000);

app.use(
  cors({
    origin: "https://zapchatfrontend-syf7.onrender.com",
    credentials: true,
  })
);

app.options(
  "*",
  cors({
    origin: "https://zapchatfrontend-syf7.onrender.com",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true, limit: "40kb" }));

app.use("/api/v1/users", userRoutes);

// const dbUrl = process.env.ATLASDB_URL;
const start = async () => {
  const connectiondB = await mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  console.log(`Connected to MongoDB : ${connectiondB.connection.host}`);
  server.listen(app.get("port"), () => {
    console.log(`Server is running on port ${app.get("port")}`);
  });
};

start();
