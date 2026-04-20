import type { WorkLogEntity } from "@domain/entities/worklog.entity";
import type { IBaseRepository } from "./base.repository";

export interface IWorkLogRepository extends IBaseRepository<WorkLogEntity> {
	findByUserId(
		userId: string,
		filters?: Record<string, unknown>,
	): Promise<WorkLogEntity[]>;
	findByProjectId(projectId: string): Promise<WorkLogEntity[]>;
	findBySprintId(sprintId: string): Promise<WorkLogEntity[]>;
	getWorkLogAnalytics(
		companyId: string,
		filters?: Record<string, unknown>,
	): Promise<unknown>;
}
