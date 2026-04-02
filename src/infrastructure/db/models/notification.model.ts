import { model } from "mongoose";
import type { INotification } from "../interface/notification.interface";
import { notificationSchema } from "../schema/notification.schema";

export const NotificationModel = model<INotification>("Notification", notificationSchema);
