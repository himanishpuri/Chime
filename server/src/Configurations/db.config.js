import { connect } from "mongoose";

const ConnectDB = async function () {
	try {
		const dbRes = await connect(process.env.MONGO_URI, {
			dbName: "Chime",
		});
		if (dbRes) console.log("Connected to MongoDB");
	} catch (error) {
		console.log("Error connecting to MongoDB:", error);
		process.exit(1);
	}
};

export default ConnectDB;
