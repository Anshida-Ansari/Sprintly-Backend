import { SubTaskStatus } from "@domain/enum/subtask/subtask.status";

export class SubTaskEntity {
	private readonly _id?: string;
	private _userStoryId: string;
	private _companyId: string;
	private _title: string;
	private _status: SubTaskStatus;
	private _assignedTo?: string;

	private _estimatedHours?: number;
	private _actualHours?: number;

	private _comments: Array<{
		userId: string;
		message: string;
		createdAt: Date;
	}> = [];

	private _attachments: Array<{
		fileUrl: string;
		fileName: string;
		uploadedBy: string;
		createdAt: Date;
	}> = [];

	private readonly _createdAt: Date;
	private _updatedAt?: Date;

	private constructor(props: {
		id?: string;
		userStoryId: string;
		companyId: string;
		title: string;
		status: SubTaskStatus;
		assignedTo?: string;
		estimatedHours?: number;
		actualHours?: number;
		comments?: Array<{
			userId: string;
			message: string;
			createdAt: Date;
		}>;
		attachments?: Array<{
			fileUrl: string;
			fileName: string;
			uploadedBy: string;
			createdAt: Date;
		}>;
		createdAt?: Date;
		updatedAt?: Date;
	}) {
		this._id = props.id;
		this._userStoryId = props.userStoryId;
		this._companyId = props.companyId;
		this._title = props.title;
		this._status = props.status;
		this._assignedTo = props.assignedTo;
		this._estimatedHours = props.estimatedHours;
		this._actualHours = props.actualHours;
		this._comments = props.comments || [];
		this._attachments = props.attachments || [];
		this._createdAt = props.createdAt || new Date();
		this._updatedAt = props.updatedAt;
	}

	static create(props: {
		id?: string;
		userStoryId: string;
		companyId: string;
		title: string;
		status?: SubTaskStatus;
		assignedTo?: string;
		estimatedHours?: number;
		actualHours?: number;
		comments?: {
			createdAt: Date;
			message: string;
			userId: string;
		}[];
		attachments?: {
			fileUrl: string;
			fileName: string;
			uploadedBy: string;
			createdAt: Date;
		}[];
	}): SubTaskEntity {
		if (!props.title?.trim()) throw new Error("Sub-task title is required");
		if (!props.userStoryId) throw new Error("User Story ID is required");
		if (!props.companyId) throw new Error("Company ID is required");

		if (props.estimatedHours !== undefined && props.estimatedHours < 0) {
			throw new Error("Estimated hours cannot be negative");
		}

		if (props.actualHours !== undefined && props.actualHours < 0) {
			throw new Error("Actual hours cannot be negative");
		}

		return new SubTaskEntity({
			...props,
			title: props.title.trim(),
			status: props.status ?? SubTaskStatus.PENDING,
			assignedTo: props.assignedTo,
			estimatedHours: props.estimatedHours,
			actualHours: props.actualHours,
			comments: props.comments || [],
			attachments: props.attachments || [],
		});
	}

	update(
		props: Partial<{
			title: string;
			status: SubTaskStatus;
			assignedTo: string;
			estimatedHours: number;
			actualHours: number;
		}>
	) {
		if (props.title !== undefined) this._title = props.title.trim();
		if (props.status !== undefined) this._status = props.status;
		if (props.assignedTo !== undefined) this._assignedTo = props.assignedTo;

		if (props.estimatedHours !== undefined) {
			if (props.estimatedHours < 0) {
				throw new Error("Estimated hours cannot be negative");
			}
			this._estimatedHours = props.estimatedHours;
		}

		if (props.actualHours !== undefined) {
			if (props.actualHours < 0) {
				throw new Error("Actual hours cannot be negative");
			}
			this._actualHours = props.actualHours;
		}

		this._updatedAt = new Date();
	}

	addComment(userId: string, message: string) {
		if (!message.trim()) {
			throw new Error("Comment cannot be empty");
		}

		this._comments.push({
			userId,
			message: message.trim(),
			createdAt: new Date(),
		});

		this._updatedAt = new Date();
	}

	addAttachment(fileUrl: string, fileName: string, uploadedBy: string) {
		if (!fileUrl || !fileName) {
			throw new Error("Invalid attachment");
		}

		this._attachments.push({
			fileUrl,
			fileName,
			uploadedBy,
			createdAt: new Date(),
		});

		this._updatedAt = new Date();
	}

	get id() {
		return this._id;
	}

	get userStoryId() {
		return this._userStoryId;
	}

	get companyId() {
		return this._companyId;
	}

	get title() {
		return this._title;
	}

	get status() {
		return this._status;
	}

	get assignedTo() {
		return this._assignedTo;
	}

	get estimatedHours() {
		return this._estimatedHours;
	}

	get actualHours() {
		return this._actualHours;
	}

	get comments() {
		return this._comments;
	}

	get attachments() {
		return this._attachments;
	}

	get createdAt() {
		return this._createdAt;
	}

	get updatedAt() {
		return this._updatedAt;
	}

	get completed() {
		return this._status === SubTaskStatus.COMPLETED;
	}
}