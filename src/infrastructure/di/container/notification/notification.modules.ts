import { ContainerModule } from "inversify";
import { CreateNotificationUseCase } from "../../../../application/usecases/notification/implementation/create.notification.usecase";
import { GetNotificationsUseCase } from "../../../../application/usecases/notification/implementation/get.notifications.usecase";
import { MarkNotificationReadUseCase } from "../../../../application/usecases/notification/implementation/mark.notification.read.usecase";
import { NotificationController } from "../../../../presentation/http/controllers/notification.controller";
import { NotificationSocketService } from "../../../../presentation/socket/notification.socket.service";
import { NotificationModel } from "../../../db/models/notification.model";
import { NotificationRepository } from "../../../db/repository/implements/notification.repository";
import { NotificationMapper } from "../../../mappers/notification.mapper";
import { NOTIFICATION_TYPE } from "../../types/notification/notification";

export const NotificationModule = new ContainerModule(({ bind }) => {
	// Model
	bind(NOTIFICATION_TYPE.NotificationModel).toConstantValue(NotificationModel);

	// Mapper
	bind(NOTIFICATION_TYPE.NotificationMapper).toConstantValue(
		NotificationMapper,
	);

	// Repository
	bind(NOTIFICATION_TYPE.INotificationRepository).to(NotificationRepository);

	// Socket
	bind(NOTIFICATION_TYPE.INotificationSocketService).to(
		NotificationSocketService,
	);

	// UseCases
	bind(NOTIFICATION_TYPE.ICreateNotificationUseCase).to(
		CreateNotificationUseCase,
	);
	bind(NOTIFICATION_TYPE.IGetNotificationsUseCase).to(GetNotificationsUseCase);
	bind(NOTIFICATION_TYPE.IMarkNotificationReadUseCase).to(
		MarkNotificationReadUseCase,
	);

	// Controller
	bind(NOTIFICATION_TYPE.NotificationController).to(NotificationController);
});
