import type { CompanyEnitiy } from "src/domain/entities/company.enities";
import type { Status } from "src/domain/enum/user/user.status.enum";
import type { IBaseRepository } from "./base.repository";

export interface ICompanyRepository extends IBaseRepository<CompanyEnitiy> {
	findByName(name: string): Promise<CompanyEnitiy | null>;
	findByStatus(status: Status): Promise<CompanyEnitiy[]>;
	findByAdminId(adminId: string): Promise<CompanyEnitiy | null>;
	findByCompanyId(companyId: string): Promise<CompanyEnitiy | null>;
}
