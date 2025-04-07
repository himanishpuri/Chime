import User from "../Models/user.model.js";

export const register = async (req, res) => {
	const { username, name, email, password } = req.body;
	try {
		const user = await User.findOne({ $or: [{ username }, { email }] });
		if (user) {
			return res.status(409).json({ message: "UserAlreadyExists" });
		} else if (await User.create({ username, name, email, password })) {
			return res.sendStatus(201);
		}
	} catch (error) {
		return res.status(500).json({ message: "ErrorCreatingUser" });
	}
};

export const login = async (req, res) => {
	const { username, password } = req.body;
	try {
		const user = await User.findOne({ username });
		if (!user) {
			return res.status(404).json({ message: "UserNotFound" });
		} else if (user.password === password) {
			return res.sendStatus(200);
		} else {
			return res.status(401).json({ message: "InvalidCredentials" });
		}
	} catch (error) {
		return res.status(500).json({ message: "ErrorLoggingIn" });
	}
};
