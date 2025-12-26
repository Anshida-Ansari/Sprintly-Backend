import { inject, injectable } from "inversify";
import { Model } from "mongoose";
import { ProjectEntity } from "src/domain/entities/project.entities";
import { IProjectReposiotory } from "../interface/project.interface";
import { BaseRepository } from "./base.repository";
import { ProjectStatus } from "src/domain/enum/project/project.status";
import { ProjectPersistanceMapper } from "src/infrastructure/mappers/project.mapper";
import { PROJECT_TYPE } from "src/infrastructure/di/types/Project/project.types";

@injectable()
export class ProjectRepository extends BaseRepository<ProjectEntity> implements IProjectReposiotory {

    constructor(
        @inject(PROJECT_TYPE.ProjectModel)
        model: Model<ProjectEntity>,

        @inject(PROJECT_TYPE.ProjectPersistanceMapper)
        private readonly _projectMapper: ProjectPersistanceMapper
    ) {
        super(model);
        this._projectMapper = _projectMapper;
    }

    async create(item: ProjectEntity): Promise<ProjectEntity> {
        const payload = this._projectMapper.toMongo(item)
        const result = await this.model.create(payload)

        return this._projectMapper.fromMongo(result)
    }
    // async update(projectId: string, entity: ProjectEntity): Promise<ProjectEntity | null> {

    //     const payload = this._projectMapper.toMongo(entity);

    //     const updatedDoc = await this.model.findByIdAndUpdate(
    //         projectId,
    //         { $set: payload },
    //         { new: true }
    //     );

    //     return updatedDoc
    //         ? this._projectMapper.fromMongo(updatedDoc)
    //         : null;
    // }

    async updateProject(id: string, project: ProjectEntity): Promise<ProjectEntity | null> {
        const payload = this._projectMapper.toMongo(project)
        const result = await this.model.findByIdAndUpdate(id, payload, { new: true })
        return result ? this._projectMapper.fromMongo(result) : null
    }

    async findById(id: string): Promise<ProjectEntity | null> {
        const doc = await this.model.findById(id)
        return doc ? this._projectMapper.fromMongo(doc) : null
    }

    async findOne(filter: any): Promise<ProjectEntity | null> {
        const doc = await this.model.findOne(filter)
        return doc ? this._projectMapper.fromMongo(doc) : null
    }

    async findByUserId(userId: string): Promise<ProjectEntity | null> {
        return this.findOne({
            members: userId
        });
    }

    async findByAdminId(adminId: string): Promise<ProjectEntity | null> {
        return this.findOne({
            createdBy: adminId
        });
    }

    async findByStatus(status: ProjectStatus): Promise<ProjectEntity[]> {
        const docs = await this.find(
            { status },
            { skip: 0, limit: 0 }
        );

        return docs.map(doc =>
            this._projectMapper.fromMongo(doc)
        );
    }
}
