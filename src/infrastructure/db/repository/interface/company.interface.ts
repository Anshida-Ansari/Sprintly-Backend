import { Status } from "src/domain/enum/user/user.status.enum";
import { IBaseRepository } from "./base.repository";
import { CompanyEnitiy } from "src/domain/entities/company.enities";

export interface ICompanyRepository extends IBaseRepository<CompanyEnitiy>{

    findByName(name: string) : Promise<CompanyEnitiy | null>
    findByStatus(status: Status): Promise<CompanyEnitiy[]>
    findByAdminId(adminId: string): Promise<CompanyEnitiy | null>
    findByCompanyId(companyId: string): Promise<CompanyEnitiy | null>
    

}