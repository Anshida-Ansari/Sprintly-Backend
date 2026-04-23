const mongoose = require("mongoose");
const uri =
	"mongodb+srv://anshidapansari_db_user:ZMY7Euiwv1APeEAh@cluster0.bj3fiho.mongodb.net/sprintly?retryWrites=true&w=majority";
mongoose
	.connect(uri)
	.then(async () => {
		const result = await mongoose.connection.db
			.collection("subscriptionplans")
			.updateMany({}, { $set: { isActive: true } });
		console.log("Updated plans:", result.modifiedCount);
		process.exit(0);
	})
	.catch((err) => {
		console.error(err);
		process.exit(1);
	});
