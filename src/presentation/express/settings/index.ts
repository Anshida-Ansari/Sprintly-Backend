import { config } from "dotenv";

config();
import connectDB from "@infrastructure/db/mongoose/connect.db.js";
import env from "@infrastructure/providers/env/env.validation.js";

import app from "./app.js";

import { createServer } from "http";
import { SocketServer } from "../../socket/socket.server.js";

const PORT = env.PORT;

connectDB();

const httpServer = createServer(app);
new SocketServer(httpServer);

httpServer.listen(PORT, () => {
	console.log(`server is running http://localhost:${PORT}`);
});
