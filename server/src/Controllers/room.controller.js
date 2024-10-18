import Room from "../Models/room.model.js";

export const getRooms = async (req, res) => {
	try {
		const rooms = await Room.find({}, "roomID").lean();
		return res.status(200).json(rooms);
	} catch (error) {
		console.log("getRooms error:", error);
		return res.status(500).json({ message: "ErrorGettingRooms" });
	}
};
