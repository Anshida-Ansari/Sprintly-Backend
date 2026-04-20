export interface INotificationSocketService {
	sendNotification(userId: string, event: string, payload: unknown): void;
}
