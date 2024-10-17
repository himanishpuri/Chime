import dotenv from "dotenv";
dotenv.config({
	path: "./.env",
});
import cors from "cors";
import express from "express";
import http from "http";
import { Server } from "socket.io";

import ChatLog from "./chatLog.model.js";
import User from "./user.model.js";
import Room from "./room.model.js";

import mongoose from "mongoose";

const dbRes = await mongoose.connect(process.env.MONGO_URI);
if (dbRes) console.log("Connected to MongoDB");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
	cors: {
		origin: "*",
	},
});

app.use(cors());

let activeRooms = [];

app.get("/api/getRooms", async (req, res) => {
	const rooms = await Room.find({}, "roomID").lean();
	return res.status(200).json(rooms);
});

server.listen(process.env.PORT, () => {
	console.log(`Server running on port ${process.env.PORT}`);
});

io.on("connection", (socket) => {
	console.log("User connected:", socket.id);

	socket.on("getChatLog", async (roomID) => {
		const room = await Room.findOne({ roomID });
		const chatLogData = await ChatLog.find(
			{ roomID: room._id },
			"senderID messageContent",
		).lean();
		const newArray = await Promise.all(
			chatLogData.map(async (chat) => {
				const user = await User.findById(chat?.senderID);
				return { sender: user?.username, message: chat?.messageContent };
			}),
		);
		socket.emit("chatLog", newArray);
	});

	socket.on("message", async (message, roomID, sender) => {
		console.log("Message:", message);
		socket.broadcast.in(roomID).emit("IncomingMessage", message, sender);
		const room = await Room.findOne({ roomID });
		const user = await User.findOne({ username: sender });
		if (!room) {
			socket.emit("Error", "RoomNotFoundToSendMessage");
			return;
		}
		if (!user) {
			socket.emit("Error", "UserNotFound");
		}
		const chatLog = await ChatLog.create({
			roomID: room._id,
			senderID: user._id,
			messageContent: message,
		});
		room.chatLogs.push(chatLog._id);
		await room.save();
	});
	socket.on("createRoom", async (roomID, senderID) => {
		if (!roomID) {
			socket.emit("Error", "RoomIDCannotBeNull");
			return;
		}
		if (await Room.findOne({ roomID })) {
			socket.emit("Error", "RoomAlreadyExists");
			return;
		}

		const user = await User.findOne({ username: senderID });

		if (!user) {
			socket.emit("Error", "UserNotFound");
			return;
		}

		await Room.create({ roomID, createdBy: user._id });
		socket.join(roomID);
		io.in(roomID).emit("RoomCreated", senderID, roomID);
	});
	socket.on("joinRoom", async (roomID, senderID) => {
		if (!(await Room.findOne({ roomID }))) {
			socket.emit("Error", "RoomNotFoundToJoin");
			return;
		}
		if (!(await User.findOne({ username: senderID }))) {
			socket.emit("Error", "UserNotFound");
			return;
		}
		socket.join(roomID);
		io.in(roomID).emit("RoomJoined", senderID, roomID);
	});
	socket.on("leaveRoom", async (roomID, senderID) => {
		if (!(await Room.findOne({ roomID }))) {
			socket.emit("Error", "RoomNotFoundToLeave");
			return;
		}
		if (!(await User.findOne({ username: senderID }))) {
			socket.emit("Error", "UserNotFound");
			return;
		}
		socket.leave(roomID);
		io.in(roomID).emit("RoomLeft", senderID, roomID);
	});
	socket.on("disconnect", () => {
		console.log("User disconnected:", socket.id);
	});
});
