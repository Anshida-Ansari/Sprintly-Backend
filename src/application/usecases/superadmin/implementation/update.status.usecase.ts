import { inject, injectable } from "inversify";

import { ErrorMessage } from "@domain/enum/messages/error.message.enum";

import type { ICompanyRepository } from "@infrastructure/db/repository/interface/company.interface";
import { COMPANY_TYPES } from "@infrastructure/di/types/company/company.types";

import { NotFoundError } from "@shared/utils/error-handling/errors/not.found.error";

import type { IUpdateStatusInterface } from "@application/usecases/superadmin/interface/update.status.interface";

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
                throw new NotFoundError(ErrorMessage.COMPANY_NOT_FOUND)
            }

            await this._companyRepository.update(companyId,{status})

            return {
                message:`company status is updated to ${status}`
            }
        } catch (error) {
            throw error
        }
    }
}