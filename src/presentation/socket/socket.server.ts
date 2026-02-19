import env from "@infrastructure/providers/env/env.validation";
import type { Server as HttpServer } from "http";
import { Server } from "socket.io";
import { SignalingGateway } from "./signaling.gateway";

export class SocketServer {
	private io: Server;
	private signalingGateway: SignalingGateway;

	constructor(httpServer: HttpServer) {
		this.io = new Server(httpServer, {
			cors: {
				origin: env.FRONTENT_URL,
				methods: ["GET", "POST"],
				credentials: true,
			},
		});

		this.signalingGateway = new SignalingGateway(this.io);
		this.initialize();
	}

	private initialize() {
		this.signalingGateway.initialize();
		console.log("Socket.io initialized");
	}
}
