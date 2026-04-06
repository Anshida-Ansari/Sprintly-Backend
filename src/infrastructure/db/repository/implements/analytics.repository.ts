import { inject, injectable } from "inversify";
import mongoose, { type Model } from "mongoose";
import { IAnalyticsRepository } from "../interface/analytics.interface";
import { WORKLOG_TYPE } from "@infrastructure/di/types/worklog/worklog";
import { SPRINTS_TYPE } from "@infrastructure/di/types/spirnts/sprints.types";
import { SUBTASK_TYPE } from "@infrastructure/di/types/subtask/subtask";
import { USERSTORY_TYPE } from "@infrastructure/di/types/userstory/userstory";

@injectable()
export class AnalyticsRepository implements IAnalyticsRepository {
	constructor(
		@inject(WORKLOG_TYPE.WorkLogModel) private readonly workLogModel: Model<any>,
		@inject(SPRINTS_TYPE.SprintModel) private readonly sprintModel: Model<any>,
		@inject(SUBTASK_TYPE.SubTaskModel) private readonly subTaskModel: Model<any>,
		@inject(USERSTORY_TYPE.UserStoryModel) private readonly userStoryModel: Model<any>
	) {}

	async getSprintBurndown(sprintId: string): Promise<any[]> {
		const sprint = await this.sprintModel.findById(sprintId);
		if (!sprint) throw new Error("Sprint not found");

		const userStories = await this.userStoryModel.find({ sprintId: new mongoose.Types.ObjectId(sprintId) });
		const userStoryIds = userStories.map(us => us._id);

	
		const subTasks = await this.subTaskModel.find({ userStoryId: { $in: userStoryIds } });
		const totalEstimated = subTasks.reduce((sum, task) => sum + (task.estimatedHours || 0), 0);

		const logs = await this.workLogModel.aggregate([
			{ $match: { sprintId: new mongoose.Types.ObjectId(sprintId) } },
			{
				$group: {
					_id: { $dateToString: { format: "%Y-%m-%d", date: "$date" } },
					dailyBurned: { $sum: "$hours" }
				}
			},
			{ $sort: { _id: 1 } }
		]);

		return this.generateBurndown(sprint.startDate, sprint.endDate, totalEstimated, logs);
	}

	async getUserBurndown(sprintId: string, userId: string): Promise<any[]> {
		const sprint = await this.sprintModel.findById(sprintId);
		if (!sprint) throw new Error("Sprint not found");

	
		const userStories = await this.userStoryModel.find({ sprintId: new mongoose.Types.ObjectId(sprintId) });
		const userStoryIds = userStories.map(us => us._id);

		const subTasks = await this.subTaskModel.find({ 
			userStoryId: { $in: userStoryIds },
			assignedTo: new mongoose.Types.ObjectId(userId)
		});
		const totalEstimated = subTasks.reduce((sum, task) => sum + (task.estimatedHours || 0), 0);

		const logs = await this.workLogModel.aggregate([
			{ 
				$match: { 
					sprintId: new mongoose.Types.ObjectId(sprintId),
					userId: new mongoose.Types.ObjectId(userId)
				} 
			},
			{
				$group: {
					_id: { $dateToString: { format: "%Y-%m-%d", date: "$date" } },
					dailyBurned: { $sum: "$hours" }
				}
			},
			{ $sort: { _id: 1 } }
		]);

		return this.generateBurndown(sprint.startDate, sprint.endDate, totalEstimated, logs);
	}

	private generateBurndown(startDate: Date, endDate: Date, totalEstimated: number, dailyLogs: any[]): any[] {
		const burndownData = [];
		let remaining = totalEstimated;

		const logsMap = new Map();
		for (const log of dailyLogs) {
			logsMap.set(log._id, log.dailyBurned);
		}

		let currentDate = new Date(startDate);
		const end = new Date(endDate);
		const today = new Date();
		currentDate.setHours(0,0,0,0);
		end.setHours(0,0,0,0);
		today.setHours(0,0,0,0);

		let dayCount = 1;
		while (currentDate <= end && currentDate <= today) {
			const dateStr = currentDate.toISOString().split('T')[0];
			const burnedToday = logsMap.get(dateStr) || 0;
			
			remaining = Math.max(0, remaining - burnedToday);

			burndownData.push({
				date: `Day ${dayCount}`,
				actualDate: dateStr,
				remaining: parseFloat(remaining.toFixed(2))
			});

			currentDate.setDate(currentDate.getDate() + 1);
			dayCount++;
		}
		
		return burndownData;
	}
}
