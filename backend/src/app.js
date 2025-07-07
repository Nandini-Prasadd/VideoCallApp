// import dotenv from "dotenv";
// dotenv.config();

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

app.use(cors());
app.use(express.json({ limit: "40kb" }));
app.use(express.urlencoded({ extended: true, limit: "40kb" }));

app.use("/api/v1/users", userRoutes);

// const dbUrl = process.env.ATLASDB_URL;
const start = async () => {
  const connectiondB = await mongoose.connect(
    "mongodb+srv://nandini070418:q8wlFoTikyJZJC4W@cluster0.kgwgjxe.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
  );
  console.log(`Connected to MongoDB : ${connectiondB.connection.host}`);
  server.listen(app.get("port"), () => {
    console.log("Server is running on port 8000");
  });
};

start();
