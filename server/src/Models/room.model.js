import { Schema, model } from "mongoose";

const roomSchema = new Schema(
	{
		roomID: {
			type: String,
			// required: true,
			// unique: true,
		},
		chatLogs: [
			{
				type: Schema.Types.ObjectId,
				ref: "ChatLog",
			},
		],
		createdBy: {
			type: Schema.Types.ObjectId,
			ref: "User",
		},
	},
	{ timestamps: true },
);

const Room = model("Room", roomSchema);

export default Room;
