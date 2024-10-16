// App.jsx
import { useState, useEffect } from "react";
import io from "socket.io-client";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const socket = io("http://localhost:9000");

const toastOpts = {
	position: "top-right",
	autoClose: 5000,
	hideProgressBar: false,
	closeOnClick: true,
	pauseOnHover: false,
	draggable: true,
	progress: undefined,
	theme: "dark",
};

function App() {
	const [message, setMessage] = useState("");
	const [messages, setMessages] = useState([]);
	const [room, setRoom] = useState("");
	const [connected, setConnected] = useState(false);
	const [chatLog, setChatLog] = useState([]);

	useEffect(() => {
		socket.on("connect", () => {
			setConnected(true);
			console.log("Socket Connected");
		});

		socket.on("disconnect", () => {
			setConnected(false);
			console.log("Socket Disconnected");
		});

		socket.on("IncomingMessage", (message, senderID) => {
			console.log("Incoming Message:", message);
			const obj = { message, sender: senderID };
			setMessages((prevMessages) => [...prevMessages, obj]);
		});

		socket.on("chatLog", (chatLogData) => {
			setChatLog(chatLogData);
		});

		socket.on("RoomCreated", (socketId, roomID) => {
			console.log(`Room ${roomID} created by ${socketId}`);
		});

		socket.on("RoomJoined", (socketId, roomID) => {
			console.log(`User ${socketId} joined room ${roomID}`);
		});

		socket.on("RoomLeft", (socketId, roomID) => {
			console.log(`User ${socketId} left room ${roomID}`);
		});

		socket.on("RoomInvalid", () => {
			console.log("Invalid Room");
		});

		return () => {
			socket.off("connect");
			socket.off("disconnect");
			socket.off("IncomingMessage");
			socket.off("chatLog");
			socket.off("RoomCreated");
			socket.off("RoomJoined");
			socket.off("RoomLeft");
			socket.off("RoomInvalid");
		};
	}, []);

	const sendMessage = () => {
		if (message.trim() && room) {
			socket.emit("message", message, room);
			setMessages((prevMessages) => [
				...prevMessages,
				{ message, sender: "You" },
			]);
			setMessage("");
			toast.success("Message Sent", toastOpts);
		}
	};

	const createRoom = () => {
		if (room.trim()) {
			socket.emit("createRoom", room);
			toast.success("Created Room", toastOpts);
		}
	};

	const joinRoom = () => {
		if (room.trim()) {
			socket.emit("joinRoom", room);
			socket.emit("getChatLog", room);
			toast.success("Joined Room", toastOpts);
		}
	};

	const leaveRoom = () => {
		if (room.trim()) {
			socket.emit("leaveRoom", room);
			toast.success("Left Room", toastOpts);
		}
	};

	return (
		<>
			<div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
				<h1 className="text-3xl font-bold mb-4">Chat Application</h1>
				<div className="mb-4">
					<input
						type="text"
						placeholder="Room ID"
						value={room}
						onChange={(e) => setRoom(e.target.value)}
						className="border rounded p-2 mr-2"
					/>
					<button
						onClick={createRoom}
						className="bg-blue-500 text-white px-4 py-2 rounded mr-2"
					>
						Create Room
					</button>
					<button
						onClick={joinRoom}
						className="bg-green-500 text-white px-4 py-2 rounded mr-2"
					>
						Join Room
					</button>
					<button
						onClick={leaveRoom}
						className="bg-red-500 text-white px-4 py-2 rounded"
					>
						Leave Room
					</button>
				</div>
				<div className="mb-4">
					<input
						type="text"
						placeholder="Message"
						value={message}
						onChange={(e) => setMessage(e.target.value)}
						className="border rounded p-2 mr-2"
					/>
					<button
						onClick={sendMessage}
						className="bg-blue-500 text-white px-4 py-2 rounded"
					>
						Send
					</button>
				</div>
				<div className="mb-4 w-full max-w-md">
					<h2 className="text-2xl font-bold mb-2">Messages</h2>
					<ul className="bg-white p-4 rounded shadow">
						{messages.map((msg, index) => (
							<li
								key={index * 23}
								className="border-b last:border-none py-2"
							>
								<span className="font-bold">{msg.sender}:</span>{" "}
								{msg.message}
							</li>
						))}
					</ul>
				</div>
				<div className="w-full max-w-md">
					<h2 className="text-2xl font-bold mb-2">Chat Log</h2>
					<ul className="bg-white p-4 rounded shadow">
						{chatLog.map((log, index) => (
							<li
								key={index * 23}
								className="border-b last:border-none py-2"
							>
								<span className="font-bold">{log.senderID}:</span>{" "}
								{log.messageContent}
							</li>
						))}
					</ul>
				</div>
			</div>
			<ToastContainer />
		</>
	);
}

export default App;
