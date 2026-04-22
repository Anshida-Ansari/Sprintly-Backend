import { inject, injectable } from "inversify";
import type { Model } from "mongoose";
import type { ProjectEntity } from "../../../../domain/entities/project.entity.js";
import type { ProjectStatus } from "../../../../domain/enum/project/project.status.js";
import { PROJECT_TYPE } from "../../../di/types/Project/project.types.js";
import type { ProjectPersistanceMapper } from "../../../mappers/project.mapper.js";
import type {
	IProjectRepository,
	IProjectWithAnalytics,
} from "../interface/project.interface.js";
import { BaseRepository } from "./base.repository.js";

@injectable()
export class ProjectRepository
	extends BaseRepository<ProjectEntity>
	implements IProjectRepository
{
	constructor(
		@inject(PROJECT_TYPE.ProjectModel)
		model: Model<ProjectEntity>,

		@inject(PROJECT_TYPE.ProjectPersistanceMapper)
		private readonly _projectMapper: ProjectPersistanceMapper,
	) {
		super(model);
		this._projectMapper = _projectMapper;
	}

	async create(item: ProjectEntity): Promise<ProjectEntity> {
		const payload = this._projectMapper.toMongo(item);
		const result = await this.model.create(payload);

		return this._projectMapper.fromMongo(result);
	}

	async updateProject(
		id: string,
		project: ProjectEntity,
	): Promise<ProjectEntity | null> {
		const payload = this._projectMapper.toMongo(project);
		const result = await this.model.findByIdAndUpdate(id, payload, {
			new: true,
		});
		return result ? this._projectMapper.fromMongo(result) : null;
	}

	async findById(id: string): Promise<ProjectEntity | null> {
		const doc = await this.model.findById(id);
		return doc ? this._projectMapper.fromMongo(doc) : null;
	}

	async findOne(
		filter: Record<string, unknown>,
	): Promise<ProjectEntity | null> {
		const doc = await this.model.findOne(filter);
		return doc ? this._projectMapper.fromMongo(doc) : null;
	}

	async findByUserId(userId: string): Promise<ProjectEntity | null> {
		return this.findOne({
			members: userId,
		});
	}

	async findByAdminId(adminId: string): Promise<ProjectEntity | null> {
		return this.findOne({
			createdBy: adminId,
		});
	}

	async findByStatus(status: ProjectStatus): Promise<ProjectEntity[]> {
		const docs = await this.find({ status }, { skip: 0, limit: 0 });

		return docs.map((doc) => this._projectMapper.fromMongo(doc));
	}

	async findWithAnalytics(
		filter: Record<string, unknown>,
		options: { skip: number; limit: number },
	): Promise<IProjectWithAnalytics[]> {
		const doneStatuses = [
			"Done",
			"done",
			"completed",
			"COMPLETED",
			"Completed",
		];

		const results = await this.model.aggregate([
			{ $match: filter },
			{
				$lookup: {
					from: "userstories",
					let: { projectId: "$_id" },
					pipeline: [
						{
							$match: {
								$expr: {
									$eq: ["$projectId", "$$projectId"],
								},
							},
						},
					],
					as: "stories",
				},
			},
			{
				$addFields: {
					analytics: {
						totalStories: { $size: "$stories" },
						completedStories: {
							$size: {
								$filter: {
									input: "$stories",
									as: "story",
									cond: { $in: ["$$story.status", doneStatuses] },
								},
							},
						},
					},
				},
			},
			{
				$addFields: {
					"analytics.progressPercentage": {
						$cond: [
							{ $gt: ["$analytics.totalStories", 0] },
							{
								$multiply: [
									{
										$divide: [
											"$analytics.completedStories",
											"$analytics.totalStories",
										],
									},
									100,
								],
							},
							0,
						],
					},
				},
			},
			{
				$project: {
					stories: 0,
				},
			},
			{ $sort: { createdAt: -1 } },
			{ $skip: options.skip },
			{ $limit: options.limit },
		]);

		return results.map((doc) => {
			const project = this._projectMapper.fromMongo(doc);
			return {
				...project,
				analytics: doc.analytics,
			} as IProjectWithAnalytics;
		});
	}
}
