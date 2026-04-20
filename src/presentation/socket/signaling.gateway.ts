import type { Server, Socket } from "socket.io";

export class SignalingGateway {
	private static io: Server;
	private static userSockets: Map<string, string> = new Map();

	constructor(io: Server) {
		SignalingGateway.io = io;
	}

	public static sendNotification(userId: string, event: string, data: unknown) {
		const socketId = SignalingGateway.userSockets.get(userId);
		if (socketId && SignalingGateway.io) {
			SignalingGateway.io.to(socketId).emit(event, data);
		}
	}

	public initialize() {
		const roomUsers: Record<
			string,
			{ socketId: string; userId: string; userName: string }[]
		> = {};
		const socketRoomMap: Map<string, string> = new Map();

		SignalingGateway.io.on("connection", (socket: Socket) => {
			console.log(`User connected: ${socket.id}`);

			socket.on("register-user", (userId: string) => {
				SignalingGateway.userSockets.set(userId, socket.id);
				console.log(`User ${userId} registered with socket ${socket.id}`);
			});

			socket.on(
				"join-room",
				(roomId: string, userId: string, userName: string) => {
					// Leave previous room if any (though usually one connection = one room)
					const previousRoom = socketRoomMap.get(socket.id);
					if (previousRoom && previousRoom !== roomId) {
						socket.leave(previousRoom);
						if (roomUsers[previousRoom]) {
							roomUsers[previousRoom] = roomUsers[previousRoom].filter(
								(u) => u.socketId !== socket.id,
							);
							socket.to(previousRoom).emit("user-left", socket.id);
						}
					}

					socket.join(roomId);
					socketRoomMap.set(socket.id, roomId);

					if (!roomUsers[roomId]) roomUsers[roomId] = [];

					// Notify others in the room
					socket
						.to(roomId)
						.emit("user-joined", { socketId: socket.id, userId, userName });

					// Send existing users to the new joiner
					const others = roomUsers[roomId];
					socket.emit("existing-users", others);

					// Add to room list
					if (!roomUsers[roomId].some((u) => u.socketId === socket.id)) {
						roomUsers[roomId].push({
							socketId: socket.id,
							userId,
							userName: userName || "Participant",
						});
					}
				},
			);

			// Handle disconnect globally
			socket.on("disconnect", () => {
				console.log(`User disconnected: ${socket.id}`);

				// Remove from userSockets map
				for (const [userId, sid] of SignalingGateway.userSockets.entries()) {
					if (sid === socket.id) {
						SignalingGateway.userSockets.delete(userId);
						break;
					}
				}

				// Remove from room and notify others
				const roomId = socketRoomMap.get(socket.id);
				if (roomId && roomUsers[roomId]) {
					roomUsers[roomId] = roomUsers[roomId].filter(
						(u) => u.socketId !== socket.id,
					);
					socket.to(roomId).emit("user-left", socket.id); // Notify room
					socketRoomMap.delete(socket.id);

					// Cleanup empty room if needed (optional)
					if (roomUsers[roomId].length === 0) {
						delete roomUsers[roomId];
					}
				}
			});

			// Signaling events
			socket.on(
				"offer",
				(payload: {
					to: string;
					offer: RTCSessionDescriptionInit;
					roomId: string;
				}) => {
					SignalingGateway.io
						.to(payload.to)
						.emit("offer", { from: socket.id, offer: payload.offer });
				},
			);

			socket.on(
				"answer",
				(payload: {
					to: string;
					answer: RTCSessionDescriptionInit;
					roomId: string;
				}) => {
					SignalingGateway.io
						.to(payload.to)
						.emit("answer", { from: socket.id, answer: payload.answer });
				},
			);

			socket.on(
				"ice-candidate",
				(payload: {
					to: string;
					candidate: RTCIceCandidate;
					roomId: string;
				}) => {
					SignalingGateway.io.to(payload.to).emit("ice-candidate", {
						from: socket.id,
						candidate: payload.candidate,
					});
				},
			);

			// Camera toggle — relay to all other room members
			socket.on(
				"camera-toggle",
				(payload: { roomId: string; isOn: boolean }) => {
					socket.to(payload.roomId).emit("peer-camera-toggle", {
						from: socket.id,
						isOn: payload.isOn,
					});
				},
			);

			// Chat
			socket.on(
				"send-chat-message",
				(payload: { roomId: string; message: string; userName: string }) => {
					socket.to(payload.roomId).emit("receive-chat-message", {
						senderId: socket.id,
						userName: payload.userName,
						message: payload.message,
						timestamp: new Date(),
					});
				},
			);

			// Host Controls
			socket.on(
				"kick-user",
				(payload: { roomId: string; targetSocketId: string }) => {
					// We should verify if the sender is an admin/lead
					// Or if they are the meeting creator.
					// For now, let's trust the client but we should ideally use a token or role check here.
					SignalingGateway.io
						.to(payload.targetSocketId)
						.emit("kicked", { roomId: payload.roomId });
				},
			);

			socket.on(
				"end-meeting",
				async (payload: { roomId: string; meetingId: string }) => {
					// Broadcast meeting-ended to all
					SignalingGateway.io
						.to(payload.roomId)
						.emit("meeting-ended", { meetingId: payload.meetingId });

					// Disconnect all sockets in the room
					const sockets = await SignalingGateway.io
						.in(payload.roomId)
						.fetchSockets();
					for (const s of sockets) {
						s.leave(payload.roomId);
					}
				},
			);
		});
	}
}
