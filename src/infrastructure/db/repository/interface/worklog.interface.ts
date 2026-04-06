import type { WorkLogEntity } from "@domain/entities/worklog.entity";
import type { IBaseRepository } from "./base.repository";

export interface IWorkLogRepository extends IBaseRepository<WorkLogEntity> {
	findByUserId(userId: string, filters?: any): Promise<WorkLogEntity[]>;
	findByProjectId(projectId: string): Promise<WorkLogEntity[]>;
	findBySprintId(sprintId: string): Promise<WorkLogEntity[]>;
	getWorkLogAnalytics(companyId: string, filters?: any): Promise<any>;
}
