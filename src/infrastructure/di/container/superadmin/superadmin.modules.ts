import {  ContainerModule } from "inversify";
import { ListCompanyUseCase } from "src/application/usecases/superadmin/implementation/list.companies.usecase";
import { SUPERADMIN_TYPES } from "../../types/superadmin/superadmin.types";
import { SuperAdminController } from "src/presentation/http/controllers/superadmin.controller";
import { UpdateStatusUseCase } from "src/application/usecases/superadmin/implementation/update.status.usecase";
import { GetDetailPageUseCase } from "src/application/usecases/superadmin/implementation/get.detailpage.usecase";
import { IListCompanyUseCase } from "src/application/usecases/superadmin/interface/list.companies.interface";
import { IUpdateStatusInterface } from "src/application/usecases/superadmin/interface/update.status.interface";
import { IGetDetailPageUseCase } from "src/application/usecases/superadmin/interface/get.detailpage.interface";

export const SuperAdminModule = new ContainerModule(({bind})=>{
    bind<IListCompanyUseCase>(SUPERADMIN_TYPES.IListCompanyUseCase).to(ListCompanyUseCase)
    bind<SuperAdminController>(SUPERADMIN_TYPES.SuperAdminController).to(SuperAdminController)
    bind<IUpdateStatusInterface>(SUPERADMIN_TYPES.IUpdateStatusInterface).to(UpdateStatusUseCase)
    bind<IGetDetailPageUseCase>(SUPERADMIN_TYPES.IGetDetailPageUseCase).to(GetDetailPageUseCase)
})