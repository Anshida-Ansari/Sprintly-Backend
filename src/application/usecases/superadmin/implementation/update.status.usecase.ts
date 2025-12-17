import { inject, injectable } from "inversify";
import { IUpdateStatusInterface } from "../interface/update.status.interface";
import { COMPANY_TYPES } from "src/infrastructure/di/types/company/company.types";
import { CompanyRepository } from "src/infrastructure/db/repository/implements/company.repositry";
import { ErrorMessage } from "src/domain/enum/messages/error.message.enum";
import { ICompanyRepository } from "src/infrastructure/db/repository/interface/company.interface";

@injectable()
export class UpdateStatusUseCase implements IUpdateStatusInterface{
    constructor(
        @inject(COMPANY_TYPES.ICompanyRepository)
        private _companyRepository:ICompanyRepository
    ){}

    async execute(companyId: string, status: string): Promise<{ message: string; }> {
        try {
            const company = await this._companyRepository.findById(companyId)

            if(!company){
                throw new Error(ErrorMessage.COMPANY_NOT_FOUND)
            }

            // company.status = status
            await this._companyRepository.update(companyId,{status})

            return {
                message:`company status is updated to ${status}`
            }
        } catch (error) {
            throw error
        }
    }
}