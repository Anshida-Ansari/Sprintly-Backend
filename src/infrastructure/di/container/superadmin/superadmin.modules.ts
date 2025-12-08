import { Container, ContainerModule } from "inversify";
import { ListCompanyUseCase } from "src/application/usecases/superadmin/implementation/list.companies.usecase";
import { ADMIN_TYPES } from "../../types/admin/admin.types";
import { SUPERADMIN_TYPES } from "../../types/superadmin/superadmin.types";
import { SuperAdminController } from "src/presentation/http/controllers/superadmin.controller";
import { UpdateStatusUseCase } from "src/application/usecases/superadmin/implementation/update.status.usecase";
import { GetDetailPageUseCase } from "src/application/usecases/superadmin/implementation/get.detailpage.usecase";

export const SuperAdminModule = new ContainerModule(({bind})=>{
    bind<ListCompanyUseCase>(SUPERADMIN_TYPES.ListCompanyUseCase).to(ListCompanyUseCase)
    bind<SuperAdminController>(SUPERADMIN_TYPES.SuperAdminController).to(SuperAdminController)
    bind<UpdateStatusUseCase>(SUPERADMIN_TYPES.UpdateStatusUseCase).to(UpdateStatusUseCase)
    bind<GetDetailPageUseCase>(SUPERADMIN_TYPES.GetDetailPageUseCase).to(GetDetailPageUseCase)
})