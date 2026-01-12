import { PriorityStatus } from "@domain/enum/userstory/user.story.priority";
import { UserStoryStatus } from "@domain/enum/userstory/user.story.status";

export class UserStoryEntity {
	private readonly _id?: string;
	private _projectId: string;
	private _companyId: string;
	private _title: string;
	private _description: string;
	private _status: UserStoryStatus;
	private _priority: PriorityStatus;
	private _sprintId?: string;
	private readonly _createdAt: Date;
	private _updatedAt?: Date;

	private constructor(props: {
		id?: string;
		projectId: string;
		companyId: string;
		title: string;
		description: string;
		status: UserStoryStatus;
		priority: PriorityStatus;
		sprintId?: string;
		createdAt?: Date;
		updatedAt?: Date;
	}) {
		this._id = props.id;
		this._projectId = props.projectId;
		this._companyId = props.companyId;
		this._title = props.title;
		this._description = props.description;
		this._status = props.status;
		this._priority = props.priority;
		this._sprintId = props.sprintId;
		this._createdAt = props.createdAt || new Date();
		this._updatedAt = props.updatedAt;
	}

	static create(props: {
		id?: string;
		projectId: string;
		companyId: string;
		title: string;
		description: string;
		priority?: PriorityStatus;
		sprintId?: string;
	}): UserStoryEntity {
		if (!props.title?.trim()) throw new Error("User story title is required");

		return new UserStoryEntity({
			...props,
			title: props.title.trim(),
			description: props.description?.trim() || "",
			companyId: props.companyId,
			status: UserStoryStatus.IN_PENDING,
			priority: PriorityStatus.MEDIUM,
			sprintId: props.sprintId,

		});
	}

	update(
		props: Partial<{
			title: string;
			description: string;
			status: UserStoryStatus;
			priority: PriorityStatus;
			sprintId: string;
		}>,
	) {
		if (props.title !== undefined) this._title = props.title.trim();
		if (props.description !== undefined)
			this._description = props.description?.trim();
		if (props.status !== undefined) this._status = props.status;
		if (props.priority !== undefined) this._priority = props.priority;
		if (props.sprintId !== undefined) this._sprintId = props.sprintId;

		this._updatedAt = new Date();
	}

	moveToBacklog() {
		this._updatedAt = new Date()
	}


	get id() {
		return this._id;
	}
	get projectId() {
		return this._projectId;
	}
	get companyId() {
		return this._companyId;
	}
	get title() {
		return this._title;
	}
	get description() {
		return this._description;
	}
	get status() {
		return this._status;
	}
	get priority() {
		return this._priority;
	}
	get sprintId() { 
		return this._sprintId; 
	}
	get createdAt() {
		return this._createdAt;
	}
	get updatedAt() {
		return this._updatedAt;
	}
}
