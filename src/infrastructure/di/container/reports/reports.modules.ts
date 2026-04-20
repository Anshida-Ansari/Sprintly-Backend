import { GetProjectReportsUseCase } from "@application/usecases/reports/implementation/get.project.reports.usecase";
import { GetSprintReportsUseCase } from "@application/usecases/reports/implementation/get.sprint.reports.usecase";
import { GetSubtaskReportsUseCase } from "@application/usecases/reports/implementation/get.subtask.reports.usecase";
import { GetUserPerformanceReportsUseCase } from "@application/usecases/reports/implementation/get.userperformance.reports.usecase";
import { GetUserStoryReportsUseCase } from "@application/usecases/reports/implementation/get.userstory.reports.usecase";
import { ReportsRepository } from "@infrastructure/db/repository/implements/reports.repository";
import { ReportsController } from "@presentation/http/controllers/reports.controller";
import { ContainerModule } from "inversify";
import { REPORTS_TYPE } from "../../types/reports/reports.types";

export const ReportsModule = new ContainerModule(({ bind }) => {
	// Repositories
	bind(REPORTS_TYPE.IReportsRepository).to(ReportsRepository);

	// Use Cases
	bind(REPORTS_TYPE.GetProjectReportsUseCase).to(GetProjectReportsUseCase);
	bind(REPORTS_TYPE.GetSprintReportsUseCase).to(GetSprintReportsUseCase);
	bind(REPORTS_TYPE.GetUserStoryReportsUseCase).to(GetUserStoryReportsUseCase);
	bind(REPORTS_TYPE.GetSubtaskReportsUseCase).to(GetSubtaskReportsUseCase);
	bind(REPORTS_TYPE.GetUserPerformanceReportsUseCase).to(
		GetUserPerformanceReportsUseCase,
	);

	// Controllers
	bind(REPORTS_TYPE.ReportsController).to(ReportsController);
});
