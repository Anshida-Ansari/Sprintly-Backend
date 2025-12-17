import { GetDetailPageUseCase } from "src/application/usecases/superadmin/implementation/get.detailpage.usecase";

export const SUPERADMIN_TYPES = {
    IListCompanyUseCase: Symbol.for('IListCompanyUseCase'),
    SuperAdminController: Symbol.for('SuperAdminController'),
    IUpdateStatusInterface: Symbol.for('IUpdateStatusInterface'),
    IGetDetailPageUseCase: Symbol.for('IGetDetailPageUseCase')
}