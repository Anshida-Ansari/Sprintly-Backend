import type { INotificationSocketService } from "@domain/interface/notification.socket.service.interface";
import { SignalingGateway } from "@presentation/socket/signaling.gateway";
import { injectable } from "inversify";

@injectable()
export class NotificationSocketService implements INotificationSocketService {
	sendNotification(userId: string, event: string, payload: any): void {
		SignalingGateway.sendNotification(userId, event, payload);
	}
}
