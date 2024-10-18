import dotenv from "dotenv";
dotenv.config({
	path: "./.env",
});
import cors from "cors";
import express from "express";
import http from "http";
import { Server } from "socket.io";

import ConnectDB from "./src/Configurations/db.config.js";

import RoomRoutes from "./src/Routes/roomRoutes.js";
import AuthRoutes from "./src/Routes/authRoutes.js";

import chatSocket from "./src/Sockets/chat.socket.js";

ConnectDB();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
	cors: {
		origin: "*",
	},
});

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/rooms", RoomRoutes);
app.use("/api/auth", AuthRoutes);

chatSocket(io);

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`);
});
