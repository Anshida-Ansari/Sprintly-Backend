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
	private _assignedTo?: string[];
	private _comments: Array<{
		createdAt: Date;
		message: string;
		userName?: string;
		userId: string;
	}> = [];
	private _estimationPoints?: number;
	private _acceptanceCriteria?: string[];
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
		assignedTo?: string[];
		comments?: Array<{
			createdAt: Date;
			message: string;
			userName?: string;
			userId: string;
		}>;
		estimationPoints?: number;
		acceptanceCriteria?: string[];
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
		this._assignedTo = props.assignedTo;
		this._comments = props.comments || [];
		this._estimationPoints = props.estimationPoints;
		this._acceptanceCriteria = props.acceptanceCriteria;
		this._createdAt = props.createdAt || new Date();
		this._updatedAt = props.updatedAt;
	}

	static create(props: {
		id?: string;
		projectId: string;
		companyId: string;
		title: string;
		description: string;
		status?: UserStoryStatus;
		priority?: PriorityStatus;
		sprintId?: string;
		assignedTo?: string[];
		comments?: {
			createdAt: Date;
			message: string;
			userName?: string;
			userId: string;
		}[];
		estimationPoints?: number;
		acceptanceCriteria?: string[];
	}): UserStoryEntity {
		if (!props.title?.trim()) throw new Error("User story title is required");
		const allowedPoints = [1, 2, 3, 5, 8, 13];

		if (
			props.estimationPoints !== undefined &&
			!allowedPoints.includes(props.estimationPoints)
		) {
			throw new Error(
				"Invalid story points. Allowed values: 1, 2, 3, 5, 8, 13"
			);
		}

		return new UserStoryEntity({
			...props,
			title: props.title.trim(),
			description: props.description?.trim() || "",
			companyId: props.companyId,
			status: props.status || UserStoryStatus.IN_PENDING,
			priority: props.priority || PriorityStatus.MEDIUM,
			sprintId: props.sprintId,
			assignedTo: props.assignedTo,
			comments: props.comments || [],
			estimationPoints: props.estimationPoints,
			acceptanceCriteria: props.acceptanceCriteria || [],
		});
	}

	update(
		props: Partial<{
			title: string;
			description: string;
			status: UserStoryStatus;
			priority: PriorityStatus;
			sprintId: string;
			assignedTo: string[];
			estimationPoints: number;
			acceptanceCriteria: string[];
		}>,
	) {
		if (props.title !== undefined) this._title = props.title.trim();
		if (props.description !== undefined)
			this._description = props.description?.trim();
		if (props.status !== undefined) this._status = props.status;
		if (props.priority !== undefined) this._priority = props.priority;
		if (props.sprintId !== undefined) this._sprintId = props.sprintId;
		if (props.assignedTo !== undefined) this._assignedTo = props.assignedTo;
		if (props.estimationPoints !== undefined) {
			const allowedPoints = [1, 2, 3, 5, 8, 13];

			if (!allowedPoints.includes(props.estimationPoints)) {
				throw new Error(
					"Invalid story points. Allowed values: 1, 2, 3, 5, 8, 13"
				);
			}

			this._estimationPoints = props.estimationPoints;
		}
		if (props.acceptanceCriteria !== undefined)
			this._acceptanceCriteria = props.acceptanceCriteria;

		this._updatedAt = new Date();
	}

	addComment(userId: string, userName: string, message: string) {
		if (!message.trim()) {
			throw new Error("Comment cannot be empty");
		}

		this._comments.push({
			userId,
			userName: userName || "",
			message: message.trim(),
			createdAt: new Date()
		});

		this._updatedAt = new Date();
	}

	moveToBacklog() {
		this._updatedAt = new Date();
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
	get assignedTo() {
		return this._assignedTo;
	}
	get comments() {
		return this._comments;
	}
	get estimationPoints() {
		return this._estimationPoints;
	}
	get acceptanceCriteria() {
		return this._acceptanceCriteria;
	}
	get createdAt() {
		return this._createdAt;
	}
	get updatedAt() {
		return this._updatedAt;
	}

	toJSON() {
		return {
			id: this._id,
			projectId: this._projectId,
			companyId: this._companyId,
			title: this._title,
			description: this._description,
			status: this._status,
			priority: this._priority,
			sprintId: this._sprintId,
			assignedTo: this._assignedTo,
			comments: this._comments,
			estimationPoints: this._estimationPoints,
			acceptanceCriteria: this._acceptanceCriteria,
			createdAt: this._createdAt,
			updatedAt: this._updatedAt,
		};
	}
}
