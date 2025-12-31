import { inject, injectable } from "inversify";
import type { IProjectReposiotory } from "src/infrastructure/db/repository/interface/project.interface";
import { PROJECT_TYPE } from "src/infrastructure/di/types/Project/project.types";
import type { IListProjectUseCase } from "../interface/list.project.interface";

@injectable()
export class ListProjectUseCase implements IListProjectUseCase{
    constructor(
        @inject(PROJECT_TYPE.IProjectRepository)
        private _projectrepository: IProjectReposiotory
    ){}

    async execute(query: { page: number; limit: number; search?: string; },companyId: string): Promise<{ data: any[]; total: number; page: number; limit: number; totalPages: number; }> {
        
        const {page,limit,search} = query
        const filter: any = {companyId}
        if(search){
            filter.name = {$regex: search, $options: "i"}
        }

        const skip = (page - 1) * limit

        const [projects,count] = await Promise.all([
            this._projectrepository.find(filter,{skip,limit}),
            this._projectrepository.count(filter)
        ])

        return {
            data:projects,
            total:count,
            page,
            limit,
            totalPages:Math.ceil(count/limit)
        }
    }

}