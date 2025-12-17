import { inject, injectable } from "inversify";
import { CompanyRepository } from "src/infrastructure/db/repository/implements/company.repositry";
import { UserRepository } from "src/infrastructure/db/repository/implements/user.repository";
import { COMPANY_TYPES } from "src/infrastructure/di/types/company/company.types";
import { USER_TYPES } from "src/infrastructure/di/types/user/user.types";
import { Request, Response } from "express";
import { SUPERADMIN_TYPES } from "src/infrastructure/di/types/superadmin/superadmin.types";
import { ListCompanyUseCase } from "src/application/usecases/superadmin/implementation/list.companies.usecase";
import { SuccessStatus } from "src/domain/enum/status-codes/success.status.enum";
import { ServerErrorStatus } from "src/domain/enum/status-codes/sever.error.status.enum";
import { UpdateStatusUseCase } from "src/application/usecases/superadmin/implementation/update.status.usecase";
import { GetDetailPageUseCase } from "src/application/usecases/superadmin/implementation/get.detailpage.usecase";
import { ICompanyRepository } from "src/infrastructure/db/repository/interface/company.interface";
import { IUserRepository } from "src/infrastructure/db/repository/interface/user.interface";
import { IUpdateStatusInterface } from "src/application/usecases/superadmin/interface/update.status.interface";
import { IGetDetailPageUseCase } from "src/application/usecases/superadmin/interface/get.detailpage.interface";

@injectable()
export class SuperAdminController{
    constructor(
    @inject(SUPERADMIN_TYPES.IListCompanyUseCase)
    private _listCompanyUseCase:ListCompanyUseCase,
    @inject(SUPERADMIN_TYPES.IUpdateStatusInterface)
    private _updateStatusUseCase:IUpdateStatusInterface,
    @inject(SUPERADMIN_TYPES.IGetDetailPageUseCase)
    private _getDetailPageUseCase:IGetDetailPageUseCase
    ){}

    async listCompanies(req:Request,res:Response){
        try {

            const {page,limit,search} = req.query

            const query = {
                page:page?Number(page):1,
                limit:limit?Number(limit):10,
                search:search?String(search):""
            }

            const response  = await this._listCompanyUseCase.execute(query)
            return res.status(SuccessStatus.OK).json({
        
                success:true,
                ...response
            })
        } catch (error:any) {
            

            return res.status(ServerErrorStatus.INTERNAL_SERVER_ERROR).json({
                success:false,
                message:error.message
            })
        }
    }
    async updateStatus(req:Request,res:Response){
        try {

            console.log('It is hitting');
            

            const {companyId} = req.params
            const {status} = req.body

            const result = await this._updateStatusUseCase.execute(companyId,status)

            res.status(SuccessStatus.OK).json({
                success:true,
                message:result.message
            })

             
        } catch (error:any) {
            res.status(ServerErrorStatus.INTERNAL_SERVER_ERROR).json({
                success:false,
                message:error.message
            })
        }
    }
    async getDetailPage(req:Request,res:Response){
        try {
            console.log('I am getting teh request log');
            
            const {companyId} = req.params
            console.log('the companyId is ',companyId);
            
            const company = await this._getDetailPageUseCase.execute(companyId)

            

            return res.status(SuccessStatus.OK).json({
                success: true,
                data:company
            })

        } catch (error:any) {

            return res.status(ServerErrorStatus.INTERNAL_SERVER_ERROR).json({
                success:false,
                message:error.message
            })
            
        }
    }
}