import { inject, injectable } from "inversify";

import type { ICompanyRepository } from "@infrastructure/db/repository/interface/company.interface";
import { COMPANY_TYPES } from "@infrastructure/di/types/company/company.types";

import type { IListCompanyUseCase } from "@application/usecases/superadmin/interface/list.companies.interface";

@injectable()
export class ListCompanyUseCase implements IListCompanyUseCase {
    constructor(
        @inject(COMPANY_TYPES.ICompanyRepository)
        private _companyrepository: ICompanyRepository
    ) { }
    async execute(query: { page: number; limit: number; search?: string; }): Promise<{ data: any[]; total: number; page: number; limit: number; totalPages: number; }> {
        try {
            const { page, limit, search } = query
            const filter: any = {}
            if (search) {
                filter.companyName = { $regex: search, $options: "i" }
            }
            const skip = (page - 1) * limit

            const [companies, count] = await Promise.all([
                this._companyrepository.find(filter, { skip, limit }),
                this._companyrepository.count(filter)
            ])

            return {
                data: companies,
                total: count,
                page,
                limit,
                totalPages: Math.ceil(count / limit)
            }
        } catch (error) {
            throw error
        }
    }

}