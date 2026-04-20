// import env from "@infrastructure/providers/env/env.validation";
// import { logger } from "@infrastructure/providers/logger/pino.logger";
// import mongoose from "mongoose";

// const connectDB = async (): Promise<void> => {
// 	try {
// 		logger.info({
// 			message: "Database connection starting",
// 			service: "database",
// 		});
// 		const _db = await mongoose.connect(env.MONGO_URI as string);

// 		logger.info({ message: "Server started", url: "http://localhost:2000" });
// 	} catch (error) {
// 		logger.error({
// 			message: "MongoDB Connection Error",
// 			error,
// 		});
// 		process.exit(1);
// 	}
// };

// export default connectDB;
import env from "@infrastructure/providers/env/env.validation";
import { logger } from "@infrastructure/providers/logger/pino.logger";
import mongoose from "mongoose";

const connectDB = async (): Promise<void> => {
	try {
		logger.info({
			message: "Database connection starting",
			service: "database",
		});

		await mongoose.connect(env.MONGO_URI as string, {
			family: 4, // 🔥 FIX: forces IPv4 (VERY IMPORTANT)
			serverSelectionTimeoutMS: 30000, // wait longer before failing
		});

		logger.info({
			message: "MongoDB Connected 🚀",
			service: "database",
		});
	} catch (error) {
		logger.error({
			message: "MongoDB Connection Error",
			error,
		});
		process.exit(1);
	}
};

export default connectDB;