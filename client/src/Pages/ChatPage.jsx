import Message from "./Components/Message.jsx";
import { useEffect, useState } from "react";
import { Button } from "@headlessui/react";
import { io } from "socket.io-client";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";

const BACKEND_URI = import.meta.env.VITE_BACKEND_URI;
const currentUser =
	JSON.parse(localStorage.getItem("user"))?.username || "primeGusty";

const socket = io(`${BACKEND_URI}`);

const ChatPage = () => {
	useEffect(() => {
		axios.get(`${BACKEND_URI}/api/getRooms`).then((res) => {
			console.log("Rooms", res.data);
			setRooms(res.data.map((room) => room.roomID));
		});

		socket.on("connect", () => {
			console.log("Connected to server");
		});
		socket.on("disconnect", () => {
			console.log("Disconnected from server");
		});
		socket.on("IncomingMessage", (message, sender) => {
			console.log("Message received", message, sender);
			const obj = {
				message,
				sender,
				type: "receiver",
			};
			setMessages((prev) => [...prev, obj]);
		});
		socket.on("RoomCreated", (senderID, roomID) => {
			console.log("Room created", roomID);
			toast.success(`Room ${roomID} created by ${senderID}`);
			const obj = {
				message: `${roomID} created by ${senderID}`,
				sender: senderID,
				type: "event",
			};
			setRooms((prev) => [...prev, roomID]);
			setCurrentRoom(roomID);
			setMessages((prev) => [...prev, obj]);
		});
		socket.on("RoomJoined", (senderID, roomID) => {
			console.log("Room joined", roomID);
			const obj = {
				message: `${senderID} joined ${roomID}`,
				sender: senderID,
				type: "event",
			};
			socket.emit("getChatLog", roomID);
			setMessages((prev) => [...prev, obj]);
		});
		socket.on("RoomInvalid", (reason) => {
			console.log("Room invalid");
			if (reason === "RoomAlreadyExists") {
				toast.error("Room already exists");
			} else if (reason === "RoomNotFoundToJoin") {
				toast.error("Room not found to join");
			} else if (reason === "UserNotFound") {
				toast.error("User not found");
			}
		});
		socket.on("chatLog", (chatLogData) => {
			console.log("Chat log received", chatLogData);
			chatLogData.forEach((chat) => {
				const obj = {
					message: chat.message,
					sender: chat.sender,
					type: chat.sender === currentUser ? "sender" : "receiver",
				};
				setMessages((prev) => [...prev, obj]);
			});
		});
		return () => {
			socket.off("connect");
			socket.off("disconnect");
			socket.off("IncomingMessage");
			socket.off("RoomCreated");
			socket.off("RoomJoined");
			socket.off("RoomInvalid");
			socket.off("chatLog");
			// socket.close();
		};
	}, []);

	const handleSendMessage = async () => {
		if (!textMessage.trim()) {
			toast.error("Message cannot be empty");
			return;
		}
		if (!currentRoom) {
			toast.error("Please join a room to send messages");
			return;
		}
		console.log("Message sent", textMessage);
		socket.emit("message", textMessage, currentRoom, currentUser);
		const obj = {
			message: textMessage,
			sender: currentUser,
			type: "sender",
		};
		setMessages((prev) => [...prev, obj]);
		setTextMessage("");
	};

	const [messages, setMessages] = useState([]);
	const [textMessage, setTextMessage] = useState("");

	const [rooms, setRooms] = useState([]);
	const [newRoomName, setNewRoomName] = useState("");
	const [currentRoom, setCurrentRoom] = useState("");

	const handleCreateRoom = () => {
		if (!newRoomName.trim()) {
			// setRooms((prev) => [...prev, newRoomName]);
			// setCurrentRoom(newRoomName);
			toast.error("Room name cannot be empty");
		}
		setNewRoomName("");
		socket.emit("createRoom", newRoomName, currentUser);
	};

	const handleJoinRoom = (roomId) => {
		if (roomId === currentRoom) {
			toast.error("You are already in this room");
			return;
		}
		console.log(`Joined room with ID: ${roomId}`);
		setCurrentRoom(roomId);
		socket.emit("joinRoom", roomId, currentUser);
	};

	return (
		<div className="flex flex-col h-screen bg-gray-300 overflow-y-visible">
			<header className="bg-blue-600 text-white p-4 flex justify-between items-center fixed top-0 left-0 right-0 z-10 shadow-lg">
				<h1 className="text-2xl font-bold">Chat Application</h1>
				<Button
					onClick={() => console.log("Logged out")}
					className="bg-blue-800 text-white px-4 py-2 rounded ml-2 hover:bg-black focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75 duration-300 transform hover:scale-105 active:scale-95"
				>
					Log Out
				</Button>
			</header>
			<main className="flex flex-1 justify-end pt-16 pb-16">
				<aside className="w-1/4 h-screen absolute left-0 bg-white p-4 overflow-y-scroll border-r border-gray-200">
					<h2 className="text-xl font-semibold mb-4">Rooms</h2>
					<ul>
						{rooms.map((roomName, index) => (
							<li
								key={index * 23}
								className="mt-2 mb-2 cursor-pointer"
							>
								<Button
									onClick={() => handleJoinRoom(roomName)}
									className="bg-gray-700 text-white px-4 py-2 rounded text-left w-full h-full hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-black-400 focus:ring-opacity-75 active:bg-red-500 duration-300 transform hover:scale-105 active:scale-95"
								>
									{roomName}
								</Button>
							</li>
						))}
					</ul>
					<div className="mt-4">
						<input
							type="text"
							placeholder="New room name"
							className="w-full p-2 border border-gray-300 rounded-lg"
							value={newRoomName}
							onChange={(e) => setNewRoomName(e.target.value)}
						/>
						<Button
							onClick={handleCreateRoom}
							className="bg-violet-500 text-white px-4 py-2 rounded mt-2 hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-opacity-75 disabled:opacity-50 disabled:bg-gray-400 disabled:cursor-not-allowed duration-300 transform hover:scale-105 active:scale-95"
							disabled={!newRoomName.trim()}
						>
							Create Room
						</Button>
					</div>
				</aside>
				<section className="flex-initial flex self-end w-3/4 flex-col bg-gray-300">
					<div className="flex-1 flex flex-col p-4 w-full overflow-y-scroll">
						{messages.map((message, index) => (
							<Message
								key={index * 23}
								message={message.message}
								sender={message?.sender}
								type={message.type}
							/>
						))}
					</div>
				</section>
			</main>
			<div className="p-4 flex w-3/4 bg-white border-t border-gray-200 fixed bottom-0 right-0">
				<input
					type="text"
					placeholder="Type a message..."
					className="w-full p-2 border border-gray-300 rounded-lg"
					value={textMessage}
					onChange={(e) => setTextMessage(e.target.value)}
				/>
				<Button
					onClick={handleSendMessage}
					className="bg-blue-500 text-white px-4 py-2 rounded ml-2 hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-black focus:ring-opacity-75 disabled:opacity-50 disabled:bg-gray-400 disabled:cursor-not-allowed duration-300 transform hover:scale-105 active:scale-95"
					disabled={!textMessage.trim()}
				>
					&gt;
				</Button>
			</div>
			<ToastContainer />
		</div>
	);
};

export default ChatPage;
