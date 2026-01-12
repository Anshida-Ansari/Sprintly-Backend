import mongoose from "mongoose";
import env from "@infrastructure/providers/env/env.validation";

const connectDB = async (): Promise<void> => {
	try {

		console.log("db is starting");

		const _db = await mongoose.connect(env.MONGO_URI as string);
		

		console.log("MongoDB Connected Successfully");
	} catch (error) {
		console.log("MongoDB Connection Error:", error);
		process.exit(1);
	}
};

export default connectDB;
