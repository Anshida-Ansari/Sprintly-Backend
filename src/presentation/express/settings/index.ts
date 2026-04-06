import { config } from "dotenv";

config();

import connectDB from "@infrastructure/db/mongoose/connect.db.js";
import env from "@infrastructure/providers/env/env.validation.js";
import { PinoLoggerService } from "@infrastructure/providers/logger/logger.service.js";
import { createServer } from "http";
import { MeetingScheduler } from "../../../infrastructure/scheduler/meeting.scheduler.js";
import { SocketServer } from "../../socket/socket.server.js";
import app from "./app.js";

const logger = new PinoLoggerService();

const PORT = env.PORT;

connectDB();

const httpServer = createServer(app);
new SocketServer(httpServer);

const meetingScheduler = new MeetingScheduler();
meetingScheduler.start();

httpServer.listen(PORT, () => {
	logger.info({
		message: "Server started",
		url: `http://localhost:${PORT}`,
	});
});
