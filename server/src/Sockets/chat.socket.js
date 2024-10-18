import ChatLog from "../Models/chatLog.model.js";
import User from "../Models/user.model.js";
import Room from "../Models/room.model.js";

const handleGetChatLog = async (socket, roomID) => {
	try {
		const room = await Room.findOne({ roomID });
		if (!room) {
			socket.emit("Error", "RoomNotFound");
			return;
		}
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
	} catch (error) {
		console.error("Error fetching chat log:", error);
		socket.emit("Error", "ErrorFetchingChatLog");
	}
};

const handleMessage = async (socket, message, roomID, sender) => {
	try {
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
			return;
		}
		const chatLog = await ChatLog.create({
			roomID: room._id,
			senderID: user._id,
			messageContent: message,
		});
		room.chatLogs.push(chatLog._id);
		await room.save();
	} catch (error) {
		console.error("Error handling message:", error);
		socket.emit("Error", "ErrorHandlingMessage");
	}
};

const handleCreateRoom = async (socket, roomID, senderID) => {
	try {
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
		socket.emit("RoomCreated", senderID, roomID);
	} catch (error) {
		console.error("Error creating room:", error);
		socket.emit("Error", "ErrorCreatingRoom");
	}
};

const handleJoinRoom = async (socket, roomID, senderID) => {
	try {
		if (!(await Room.findOne({ roomID }))) {
			socket.emit("Error", "RoomNotFoundToJoin");
			return;
		}
		if (!(await User.findOne({ username: senderID }))) {
			socket.emit("Error", "UserNotFound");
			return;
		}
		socket.join(roomID);
		socket.emit("RoomJoined", senderID, roomID);
	} catch (error) {
		console.error("Error joining room:", error);
		socket.emit("Error", "ErrorJoiningRoom");
	}
};

const handleLeaveRoom = async (socket, roomID, senderID) => {
	try {
		if (!(await Room.findOne({ roomID }))) {
			socket.emit("Error", "RoomNotFoundToLeave");
			return;
		}
		if (!(await User.findOne({ username: senderID }))) {
			socket.emit("Error", "UserNotFound");
			return;
		}
		socket.leave(roomID);
		socket.emit("RoomLeft", senderID, roomID);
	} catch (error) {
		console.error("Error leaving room:", error);
		socket.emit("Error", "ErrorLeavingRoom");
	}
};

const handleDisconnect = (socket) => {
	console.log("User disconnected:", socket.id);
};

const chatSocket = (io) => {
	io.on("connection", (socket) => {
		console.log("User connected:", socket.id);

		socket.on("getChatLog", (roomID) => handleGetChatLog(socket, roomID));
		socket.on("message", (message, roomID, sender) =>
			handleMessage(socket, message, roomID, sender),
		);
		socket.on("createRoom", (roomID, senderID) =>
			handleCreateRoom(socket, roomID, senderID),
		);
		socket.on("joinRoom", (roomID, senderID) =>
			handleJoinRoom(socket, roomID, senderID),
		);
		socket.on("leaveRoom", (roomID, senderID) =>
			handleLeaveRoom(socket, roomID, senderID),
		);
		socket.on("disconnect", () => handleDisconnect(socket));
	});
};

export default chatSocket;
