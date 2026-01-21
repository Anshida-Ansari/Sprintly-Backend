import { Server, Socket } from "socket.io";

export class SignalingGateway {
    private io: Server;

    constructor(io: Server) {
        this.io = io;
    }

    public initialize() {
        this.io.on("connection", (socket: Socket) => {
            console.log(`User connected: ${socket.id}`);

            socket.on("join-room", (roomId: string, userId: string) => {
                socket.join(roomId);
                console.log(`User ${userId} joined room ${roomId}`);
                socket.to(roomId).emit("user-connected", userId);

                socket.on("disconnect", () => {
                    console.log(`User ${userId} disconnected from room ${roomId}`);
                    socket.to(roomId).emit("user-disconnected", userId);
                });
            });

            socket.on("offer", (payload: any) => {
         
                if (payload.to) {
                    socket.to(payload.roomId).emit("offer", payload);
                } else {
                    socket.to(payload.roomId).emit("offer", payload);
                }
            });

            socket.on("answer", (payload: any) => {
                socket.to(payload.roomId).emit("answer", payload);
            });

            socket.on("ice-candidate", (payload: any) => {
                socket.to(payload.roomId).emit("ice-candidate", payload);
            });
        });
    }
}
