import { inject, injectable } from "inversify";
import { ICompany } from "../../interface/company.interface";
import { ICompanyRepository } from "../interface/company.interface";
import { BaseRepository } from "./base.repository";
import { AUTH_TYPES } from "src/infrastructure/di/types/auth/auth.types";
import { COMPANY_TYPES } from "src/infrastructure/di/types/company/company.types";
import {  Model } from "mongoose";
import { CompanyEnitiy } from "src/domain/entities/company.enities";
import { CompanyPersistenceMapper } from "src/infrastructure/mappers/company.persistance.mapper";
import { Status } from "src/domain/enum/user/user.status.enum";


@injectable()
    
export class CompanyRepository extends BaseRepository<CompanyEnitiy> implements ICompanyRepository{
    // private readonly _companyMapper:CompanyPersistenceMapper

    constructor(

        @inject(COMPANY_TYPES.CompanyModel)
         model:Model<CompanyEnitiy> ,
        @inject(COMPANY_TYPES.CompanyPersistenceMapper)
         private readonly _companyMapper : CompanyPersistenceMapper  ,
        
        
    ){
        super(model)
        // this._companyMapper = _companyMapper
    }

   async findByName(name: string): Promise<CompanyEnitiy | null> {
       
    const doc = await this.findOne({companyName:name})
    return doc? this._companyMapper.fromMongo(doc):null
   }

   async findByStatus(status: Status): Promise<CompanyEnitiy[]> {
    const docs = await this.find({status},{limit:10,skip:12})
    return docs.map(doc=> this._companyMapper.fromMongo(doc))
   }

   async findByAdminId(adminId: string): Promise<CompanyEnitiy | null> {
       const doc = await this.findOne({adminId})
       return doc? this._companyMapper.fromMongo(doc):null
   }

   async findByCompanyId(companyId: string): Promise<CompanyEnitiy | null>{
    const doc = await this.findOne({_id :companyId})
    return doc? this._companyMapper.fromMongo(doc):null
   }

   
} 