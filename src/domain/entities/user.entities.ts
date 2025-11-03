import { ObjectId } from "mongoose";

export class User {
  constructor(
    public readonly _id: ObjectId,
    public name: string,
    public email: string,
    public password: string,
    public role: "SuperAdmin" | "Admin" | "Developers",
    public companyId?: ObjectId,
    public companyname?: string,
    public performanceScore: number = 0,
    public lastActive: Date = new Date(),
    public projects: ObjectId[] = [],
    public notificationPreferences = {
      emailNotification: true,
      pushNotification: true,
    }
  ) {}
}