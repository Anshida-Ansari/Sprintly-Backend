export class WorkLogEntity {
	private readonly _id?: string;
	private _userId: string;
	private _projectId: string;
	private _sprintId: string;
	private _taskId: string;
	private _subTaskId: string;
	private _hours: number;
	private _description: string;
	private _date: Date;
	private readonly _createdAt: Date;
	private _updatedAt?: Date;

	private constructor(props: {
		id?: string;
		userId: string;
		projectId: string;
		sprintId: string;
		taskId: string;
		subTaskId: string;
		hours: number;
		description: string;
		date: Date;
		createdAt?: Date;
		updatedAt?: Date;
	}) {
		this._id = props.id;
		this._userId = props.userId;
		this._projectId = props.projectId;
		this._sprintId = props.sprintId;
		this._taskId = props.taskId;
		this._subTaskId = props.subTaskId;
		this._hours = props.hours;
		this._description = props.description;
		this._date = props.date;
		this._createdAt = props.createdAt || new Date();
		this._updatedAt = props.updatedAt;
	}

	static create(props: {
		id?: string;
		userId: string;
		projectId: string;
		sprintId: string;
		taskId: string;
		subTaskId: string;
		hours: number;
		description: string;
		date: Date;
		createdAt?: Date;
		updatedAt?: Date;
	}): WorkLogEntity {
		if (props.hours <= 0) {
			throw new Error("Hours must be greater than 0");
		}
		if (props.date > new Date()) {
			throw new Error("Date cannot be in the future");
		}
		if (!props.userId) throw new Error("User ID is required");
		if (!props.projectId) throw new Error("Project ID is required");
		if (!props.subTaskId) throw new Error("Subtask ID is required");

		return new WorkLogEntity({
			...props,
			description: props.description?.trim() || "",
		});
	}

	update(props: Partial<{
		hours: number;
		description: string;
		date: Date;
	}>) {
		if (props.hours !== undefined) {
			if (props.hours <= 0) throw new Error("Hours must be greater than 0");
			this._hours = props.hours;
		}
		if (props.description !== undefined) {
			this._description = props.description.trim();
		}
		if (props.date !== undefined) {
			if (props.date > new Date()) throw new Error("Date cannot be in the future");
			this._date = props.date;
		}
		this._updatedAt = new Date();
	}

	get id() { return this._id; }
	get userId() { return this._userId; }
	get projectId() { return this._projectId; }
	get sprintId() { return this._sprintId; }
	get taskId() { return this._taskId; }
	get subTaskId() { return this._subTaskId; }
	get hours() { return this._hours; }
	get description() { return this._description; }
	get date() { return this._date; }
	get createdAt() { return this._createdAt; }
	get updatedAt() { return this._updatedAt; }

	toJSON() {
		return {
			id: this._id,
			userId: this._userId,
			projectId: this._projectId,
			sprintId: this._sprintId,
			taskId: this._taskId,
			subTaskId: this._subTaskId,
			hours: this._hours,
			description: this._description,
			date: this._date,
			createdAt: this._createdAt,
			updatedAt: this._updatedAt,
		};
	}
}
