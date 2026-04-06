import mongoose from "mongoose";

const MONGO_URI = "mongodb://localhost:27017/srpintly";

mongoose
	.connect(MONGO_URI)
	.then(async () => {
		const SubtaskModel = mongoose.model(
			"SubTask",
			new mongoose.Schema({}, { strict: false }),
			"subtasks",
		);

		// const allSubtasks = await SubtaskModel.find({}).lean();

		mongoose.connection.close();
	})
	.catch((err) => {
		process.exit(1);
	});
