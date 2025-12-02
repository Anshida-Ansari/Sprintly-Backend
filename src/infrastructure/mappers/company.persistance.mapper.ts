import { CompanyEnitiy } from "src/domain/entities/company.enities";


export class CompanyPersistenceMapper{
    toMongo(company: CompanyEnitiy){
        return{

            companyName: company.companyName,
            status: company.status,
            adminId: company.adminId,
        }
    }

    fromMongo(doc: any):CompanyEnitiy{
        return CompanyEnitiy.create({
            id:doc._id?.toString(),
            companyName:doc.companyName,
            status:doc.status,
            adminId:doc.adminId?.toString()
        })
    }
}

