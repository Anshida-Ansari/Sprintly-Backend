import { Server, Socket } from "socket.io";

export class SignalingGateway {
    private static io: Server;
    private static userSockets: Map<string, string> = new Map(); // userId -> socketId

    constructor(io: Server) {
        SignalingGateway.io = io;
    }

    public static sendNotification(userId: string, event: string, data: any) {
        const socketId = this.userSockets.get(userId);
        if (socketId && this.io) {
            this.io.to(socketId).emit(event, data);
        }
    }

    public initialize() {
        const roomUsers: Record<string, string[]> = {}; 

        SignalingGateway.io.on("connection", (socket: Socket) => {
            console.log(`User connected: ${socket.id}`);

            socket.on("register-user", (userId: string) => {
                SignalingGateway.userSockets.set(userId, socket.id);
                console.log(`User ${userId} registered with socket ${socket.id}`);
            });

            socket.on("disconnect", () => {
                for (const [userId, sid] of SignalingGateway.userSockets.entries()) {
                    if (sid === socket.id) {
                        SignalingGateway.userSockets.delete(userId);
                        break;
                    }
                }
            });

            socket.on("join-room", (roomId: string, userId: string) => {
                socket.join(roomId);

                if (!roomUsers[roomId]) roomUsers[roomId] = [];
                socket.to(roomId).emit("user-joined", { socketId: socket.id, userId });

                const others = roomUsers[roomId].map(id => ({ socketId: id }));
                socket.emit("existing-users", others);

                roomUsers[roomId].push(socket.id);

                socket.on("disconnect", () => {
                    roomUsers[roomId] = roomUsers[roomId].filter(id => id !== socket.id);
                    socket.to(roomId).emit("user-left", socket.id);
                });
            });

            socket.on("offer", (payload: { to: string; offer: RTCSessionDescriptionInit; roomId: string }) => {
                SignalingGateway.io.to(payload.to).emit("offer", { from: socket.id, offer: payload.offer });
            });

            socket.on("answer", (payload: { to: string; answer: RTCSessionDescriptionInit; roomId: string }) => {
                SignalingGateway.io.to(payload.to).emit("answer", { from: socket.id, answer: payload.answer });
            });

            socket.on("ice-candidate", (payload: { to: string; candidate: RTCIceCandidate; roomId: string }) => {
                SignalingGateway.io.to(payload.to).emit("ice-candidate", { from: socket.id, candidate: payload.candidate });
            });
        });
    }
}
