import { inject, injectable } from "inversify";
import type { Model } from "mongoose";
import type { CompanyEnitiy } from "../../../../domain/entities/company.enities";
import type { Status } from "../../../../domain/enum/user/user.status.enum";
import { COMPANY_TYPES } from "../../../di/types/company/company.types";
import type { CompanyPersistenceMapper } from "../../../mappers/company.persistance.mapper";
import type { ICompanyRepository } from "../interface/company.interface";
import { BaseRepository } from "./base.repository";


@injectable()

export class CompanyRepository extends BaseRepository<CompanyEnitiy> implements ICompanyRepository {
    // private readonly _companyMapper:CompanyPersistenceMapper

    constructor(

        @inject(COMPANY_TYPES.CompanyModel)
        model: Model<CompanyEnitiy>,
        @inject(COMPANY_TYPES.CompanyPersistenceMapper)
        private readonly _companyMapper: CompanyPersistenceMapper,


    ) {
        super(model)
        // this._companyMapper = _companyMapper
    }

    async findByName(name: string): Promise<CompanyEnitiy | null> {

        const doc = await this.findOne({ companyName: name })
        return doc ? this._companyMapper.fromMongo(doc) : null
    }

    async findByStatus(status: Status): Promise<CompanyEnitiy[]> {
        const docs = await this.find({ status }, { limit: 10, skip: 12 })
        return docs.map(doc => this._companyMapper.fromMongo(doc))
    }

    async findByAdminId(adminId: string): Promise<CompanyEnitiy | null> {
        const doc = await this.findOne({ adminId })
        return doc ? this._companyMapper.fromMongo(doc) : null
    }

    async findByCompanyId(companyId: string): Promise<CompanyEnitiy | null> {
        const doc = await this.findOne({ _id: companyId })
        return doc ? this._companyMapper.fromMongo(doc) : null
    }


} 