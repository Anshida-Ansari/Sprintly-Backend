import { ContainerModule } from "inversify";
import { GetDetailPageUseCase } from "src/application/usecases/superadmin/implementation/get.detailpage.usecase";
import { ListCompanyUseCase } from "src/application/usecases/superadmin/implementation/list.companies.usecase";
import { UpdateStatusUseCase } from "src/application/usecases/superadmin/implementation/update.status.usecase";
import type { IGetDetailPageUseCase } from "src/application/usecases/superadmin/interface/get.detailpage.interface";
import type { IListCompanyUseCase } from "src/application/usecases/superadmin/interface/list.companies.interface";
import type { IUpdateStatusInterface } from "src/application/usecases/superadmin/interface/update.status.interface";
import { SuperAdminController } from "src/presentation/http/controllers/superadmin.controller";
import { SUPERADMIN_TYPES } from "../../types/superadmin/superadmin.types";

export const SuperAdminModule = new ContainerModule(({ bind }) => {
	bind<IListCompanyUseCase>(SUPERADMIN_TYPES.IListCompanyUseCase).to(
		ListCompanyUseCase,
	);
	bind<SuperAdminController>(SUPERADMIN_TYPES.SuperAdminController).to(
		SuperAdminController,
	);
	bind<IUpdateStatusInterface>(SUPERADMIN_TYPES.IUpdateStatusInterface).to(
		UpdateStatusUseCase,
	);
	bind<IGetDetailPageUseCase>(SUPERADMIN_TYPES.IGetDetailPageUseCase).to(
		GetDetailPageUseCase,
	);
});
