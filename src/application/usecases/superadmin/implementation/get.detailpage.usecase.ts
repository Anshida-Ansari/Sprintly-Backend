import { inject, injectable } from "inversify";
import { ErrorMessage } from "../../../../domain/enum/messages/error.message.enum";
import type { ICompanyRepository } from "../../../../infrastructure/db/repository/interface/company.interface";
import { COMPANY_TYPES } from "../../../../infrastructure/di/types/company/company.types";
import { NotFoundError } from "../../../../shared/utils/error-handling/errors/not.found.error";
import type { IGetDetailPageUseCase } from "../interface/get.detailpage.interface";

@injectable()
export class GetDetailPageUseCase implements IGetDetailPageUseCase{
    constructor(
        @inject(COMPANY_TYPES.ICompanyRepository)
        private _companyrepository:ICompanyRepository
    ){}

    async execute(companyId: string): Promise<any> {
            
            const company = await this._companyrepository.findByCompanyId(companyId)
            

            if(!company){
                return new NotFoundError(ErrorMessage.COMPANY_NOT_FOUND)
            }

            return {
                id:company.id,
                companyName:company.companyName,
                status:company.status,
                adminId:company.adminId,
                
            }

    }
}