import { inject, injectable } from "inversify";
import { IGetDetailPageUseCase } from "../interface/get.detailpage.interface";
import { COMPANY_TYPES } from "../../../../infrastructure/di/types/company/company.types";
import { ICompanyRepository } from "../../../../infrastructure/db/repository/interface/company.interface";
import { ErrorMessage } from "../../../../domain/enum/messages/error.message.enum";

@injectable()
export class GetDetailPageUseCase implements IGetDetailPageUseCase{
    constructor(
        @inject(COMPANY_TYPES.ICompanyRepository)
        private _companyrepository:ICompanyRepository
    ){}

    async execute(companyId: string): Promise<any> {
        try {
            // console.log('it reaches the usecase ');
            
            const company = await this._companyrepository.findByCompanyId(companyId)
            console.log('company is ',company);
            

            if(!company){
                return new Error(ErrorMessage.COMPANY_NOT_FOUND)
            }

            return {
                id:company.id,
                companyName:company.companyName,
                status:company.status,
                adminId:company.adminId,
                
            }

        } catch (error) {
            throw error
        }
    }
}