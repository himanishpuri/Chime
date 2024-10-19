import User from "../Models/user.model.js";

export const getRooms = async (req, res) => {
	const { currentUser: username } = req.body;
	try {
		const user = await User.findOne({ username })
			.populate("rooms", "roomID")
			.lean();
		if (!user) {
			return res.status(404).json({ message: "UserNotFound" });
		}
		return res.status(200).json(user.rooms);
	} catch (error) {
		console.log("getRooms error:", error);
		return res.status(500).json({ message: "ErrorGettingRooms" });
	}
};
