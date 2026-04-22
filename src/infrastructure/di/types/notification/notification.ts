export const NOTIFICATION_TYPE = {
	NotificationModel: Symbol.for("NotificationModel"),
	NotificationMapper: Symbol.for("NotificationMapper"),
	INotificationRepository: Symbol.for("INotificationRepository"),
	INotificationSocketService: Symbol.for("INotificationSocketService"),
	ICreateNotificationUseCase: Symbol.for("ICreateNotificationUseCase"),
	IGetNotificationsUseCase: Symbol.for("IGetNotificationsUseCase"),
	IMarkNotificationReadUseCase: Symbol.for("IMarkNotificationReadUseCase"),
	NotificationController: Symbol.for("NotificationController"),
};
