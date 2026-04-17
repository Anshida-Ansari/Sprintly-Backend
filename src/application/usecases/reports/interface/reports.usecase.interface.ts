export interface IGetProjectReportsUseCase {
	execute(companyId: string, filters: any): Promise<{ data: any[]; total: number }>;
}

export interface IGetSprintReportsUseCase {
	execute(companyId: string, filters: any): Promise<{ data: any[]; total: number }>;
}

export interface IGetUserStoryReportsUseCase {
	execute(companyId: string, filters: any): Promise<{ data: any[]; total: number }>;
}

export interface IGetSubtaskReportsUseCase {
	execute(companyId: string, filters: any): Promise<{ data: any[]; total: number }>;
}

export interface IGetUserPerformanceReportsUseCase {
	execute(companyId: string, filters: any): Promise<{ data: any[]; total: number }>;
}
