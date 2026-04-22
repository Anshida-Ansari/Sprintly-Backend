import { ContainerModule } from "inversify";
import type { Model } from "mongoose";
import type { ICompany } from "../../../db/interface/company.interface";
import { CompanyModel } from "../../../db/models/company.model";
import { CompanyRepository } from "../../../db/repository/implements/company.repository";
import type { ICompanyRepository } from "../../../db/repository/interface/company.interface";
import { CompanyPersistenceMapper } from "../../../mappers/company.persistence.mapper";
import { COMPANY_TYPES } from "../../types/company/company.types";

export const CompanyModule = new ContainerModule(({ bind }) => {
	bind<ICompanyRepository>(COMPANY_TYPES.ICompanyRepository).to(
		CompanyRepository,
	);
	bind<Model<ICompany>>(COMPANY_TYPES.CompanyModel).toConstantValue(
		CompanyModel,
	);
	bind<CompanyPersistenceMapper>(COMPANY_TYPES.CompanyPersistenceMapper).to(
		CompanyPersistenceMapper,
	);
});
