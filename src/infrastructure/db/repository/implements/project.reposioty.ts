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
    async findByUserId(userId: string): Promise<ProjectEntity | null> {
        const doc = await this.findOne({
            members: userId
        });

        return doc ? this._projectMapper.fromMongo(doc) : null;
    }

    async findByAdminId(adminId: string): Promise<ProjectEntity | null> {
        const doc = await this.findOne({
            createdBy: adminId
        });

        return doc ? this._projectMapper.fromMongo(doc) : null;
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
