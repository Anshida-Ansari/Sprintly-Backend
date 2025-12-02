import { ContainerModule } from "inversify";
import { CompanyRepository } from "src/infrastructure/db/repository/implements/company.repositry";
import { COMPANY_TYPES } from "../../types/company/company.types";
import { CompanyModel } from "src/infrastructure/db/models/company.model";
import { CompanyPersistenceMapper } from "src/infrastructure/mappers/company.persistance.mapper";
import { Model } from "mongoose";
import { ICompany } from "src/infrastructure/db/interface/company.interface";
import { UserPersistenceMapper } from "src/infrastructure/mappers/user.percistance.mapper";
import { ICompanyRepository } from "src/infrastructure/db/repository/interface/company.interface";

export const CompanyModule = new ContainerModule(({bind})=>{
    bind<ICompanyRepository>(COMPANY_TYPES.CompanyRepository).to(CompanyRepository)
    bind<Model<ICompany>>(COMPANY_TYPES.CompanyModel).toConstantValue(CompanyModel)
    bind<CompanyPersistenceMapper>(COMPANY_TYPES.CompanyPersistenceMapper).to(CompanyPersistenceMapper)
    
})