import { config } from "dotenv";

config();

import connectDB from "@infrastructure/db/mongoose/connect.db.js";
import env from "@infrastructure/providers/env/env.validation.js";
import { createServer } from "http";
import { SocketServer } from "../../socket/socket.server.js";
import app from "./app.js";
import { PinoLoggerService } from "@infrastructure/providers/logger/logger.service.js";

const logger = new PinoLoggerService()


const PORT = env.PORT;

connectDB();

const httpServer = createServer(app);
new SocketServer(httpServer);

httpServer.listen(PORT, () => {
	logger.info({
		message: "Server started",
		url: `http://localhost:${PORT}`
	});
});
