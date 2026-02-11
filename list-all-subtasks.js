const mongoose = require("mongoose");

const MONGO_URI = "mongodb://localhost:27017/srpintly";

mongoose
	.connect(MONGO_URI)
	.then(async () => {
		console.log("Connected to MongoDB");

		const SubtaskModel = mongoose.model(
			"SubTask",
			new mongoose.Schema({}, { strict: false }),
			"subtasks",
		);

		const allSubtasks = await SubtaskModel.find({}).lean();

		console.log("\n=== ALL SUBTASKS IN DATABASE ===");
		console.log(`Total count: ${allSubtasks.length}\n`);

		allSubtasks.forEach((subtask, index) => {
			console.log(`Subtask ${index + 1}:`);
			console.log(`  _id: ${subtask._id}`);
			console.log(`  title: ${subtask._title || subtask.title || "N/A"}`);
			console.log(`  status: ${subtask._status || subtask.status || "N/A"}`);
			console.log(
				`  assignedTo: ${subtask._assignedTo || subtask.assignedTo || "N/A"}`,
			);
			console.log(
				`  userStoryId: ${subtask._userStoryId || subtask.userStoryId || "N/A"}`,
			);
			console.log("");
		});

		mongoose.connection.close();
	})
	.catch((err) => {
		console.error("MongoDB connection error:", err);
		process.exit(1);
	});
