import { Schema, model } from "mongoose";

const chatLogSchema = new Schema({
	senderID: {
		type: Schema.Types.ObjectId,
		ref: "User",
		required: true,
		default: null,
	},
	roomID: {
		type: Schema.Types.ObjectId,
		ref: "Room",
		required: true,
	},
	messageContent: {
		type: String,
		required: true,
	},
	messageType: {
		type: String,
		required: true,
		default: "text",
	},
	timestamp: {
		type: Date,
		default: Date.now,
	},
});

export default model("ChatLog", chatLogSchema);
