import { GetDetailPageUseCase } from "src/application/usecases/superadmin/implementation/get.detailpage.usecase";

export const SUPERADMIN_TYPES = {
    ListCompanyUseCase: Symbol.for('ListCompanyUseCase'),
    SuperAdminController: Symbol.for('SuperAdminController'),
    UpdateStatusUseCase: Symbol.for('UpdateStatusUseCase'),
    GetDetailPageUseCase: Symbol.for('GetDetailPageUseCase')
}