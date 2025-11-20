import { ObjectId } from "mongoose";

export class Project {
  constructor(
    public _id: ObjectId,
    public name: string,
    public description: string,
    public status: "Planned" | "InProgress" | "Completed" | "OnHold",
    public startDate: Date,
    public endDate: Date,
    public members: ObjectId[] = [],
    public gitRepoUrls: string[] = [],
    public createdAt: Date = new Date(),
    public updatedAt: Date = new Date()
  ) {}
}
