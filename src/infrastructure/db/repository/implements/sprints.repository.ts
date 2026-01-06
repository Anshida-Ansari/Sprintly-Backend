import { inject, injectable } from "inversify";
import { BaseRepository } from "./base.repository";
import { SprintEntity } from "src/domain/entities/sptint.entities";
import { ISprintReposiotry } from "../interface/sprints.interface";
import { SPRINTS_TYPE } from "src/infrastructure/di/types/spirnts/sprints.types";
import { Model } from "mongoose";
import { SprintPersistenceMapper } from "src/infrastructure/mappers/sprints.mapper";
import { SprintStatus } from "src/domain/enum/sprints/sprints.status";

@injectable()
export class SprintsRepository extends BaseRepository<SprintEntity> implements ISprintReposiotry {
    constructor(
        @inject(SPRINTS_TYPE.SprintModel)
        model: Model<SprintEntity>,

        @inject(SPRINTS_TYPE.SprintPersistenceMapper)
        private readonly _sprintsMapper: SprintPersistenceMapper
    ) {
        super(model)
    }

    async create(entity: SprintEntity): Promise<SprintEntity> {
        const payload = this._sprintsMapper.toMongo(entity)
        const result = await this.model.create(payload);

        return this._sprintsMapper.fromMongo(result);
    }


    async findActiveSprintByProject(
        projectId: string
    ): Promise<SprintEntity | null> {
        const result = await this.model.findOne({
            projectId,
            status: SprintStatus.ACTIVE,
        });

        return result ? this._sprintsMapper.fromMongo(result) : null;
    }

    async hasActiveSprint(projectId: string): Promise<boolean> {
        const count = await this.model.countDocuments({
            projectId,
            status: SprintStatus.ACTIVE,
        });

        return count > 0;
    }

    async hasOverlappingSprint(
        projectId: string,
        startDate: Date,
        endDate: Date,
        excludeSprintId?: string
    ): Promise<boolean> {
        const filter: any = {
            projectId,
            startDate: { $lt: endDate },
            endDate: { $gt: startDate },
        };

        if (excludeSprintId) {
            filter._id = { $ne: excludeSprintId };
        }

        const count = await this.model.countDocuments(filter);
        return count > 0;
    }

    async findByProject(
        projectId: string,
        companyId: string
    ): Promise<SprintEntity[]> {
        const docs = await this.model
            .find({ projectId, companyId })
            .sort({ startDate: 1 });

        return docs.map(doc => this._sprintsMapper.fromMongo(doc));
    }

    async listByProject(params: { projectId: string; companyId: string; page: number; limit: number; search?: string; status?: string; }): Promise<{ data: SprintEntity[]; total: number; }> {

        const { projectId, companyId, page, limit, search, status } = params

        const filter: any = {
            projectId,
            companyId
        }

        if (search) {
            filter.name = { $regex: search, $options: "i" }
        }

        if (status) {
            filter.status = status
        }

        const skip = (page - 1) * limit

        const [docs, total] = await Promise.all([
            this.model.find(filter).skip(skip).limit(limit),
            this.model.countDocuments(filter)
        ])

        return {
            data: docs.map(doc => this._sprintsMapper.fromMongo(doc)),
            total
        }
    }
}
