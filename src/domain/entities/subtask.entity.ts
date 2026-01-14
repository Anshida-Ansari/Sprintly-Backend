import { SubTaskStatus } from "@domain/enum/subtask/subtask.status";

export class SubTaskEntity {
    private readonly _id?: string;
    private _userStoryId: string;
    private _companyId: string; 
    private _title: string;
    private _status: SubTaskStatus;
    private _assignedTo?: string;
    private readonly _createdAt: Date;
    private _updatedAt?: Date;

    private constructor(props: {
        id?: string;
        userStoryId: string;
        companyId: string; 
        title: string;
        status: SubTaskStatus;
        assignedTo?: string;
        createdAt?: Date;
        updatedAt?: Date;
    }) {
        this._id = props.id;
        this._userStoryId = props.userStoryId;
        this._companyId = props.companyId;
        this._title = props.title;
        this._status = props.status;
        this._assignedTo = props.assignedTo;
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
    }): SubTaskEntity {
        if (!props.title?.trim()) throw new Error("Sub-task title is required");
        if (!props.userStoryId) throw new Error("User Story ID is required");
        if (!props.companyId) throw new Error("Company ID is required");

        return new SubTaskEntity({
            ...props,
            title: props.title.trim(),
            status: props.status ?? SubTaskStatus.PENDING,
            assignedTo: props.assignedTo,
        });
    }

    update(props: Partial<{
        title: string;
        status: SubTaskStatus;
        assignedTo: string;
    }>) {
        if (props.title !== undefined) this._title = props.title.trim();
        if (props.status !== undefined) this._status = props.status;
        if (props.assignedTo !== undefined) this._assignedTo = props.assignedTo;

        this._updatedAt = new Date();
    }

    // Getters
    get id() { return this._id; }
    get userStoryId() { return this._userStoryId; }
    get companyId() { return this._companyId; } 
    get title() { return this._title; }
    get status() { return this._status; }
    get assignedTo() { return this._assignedTo; }
    get createdAt() { return this._createdAt; }
    get updatedAt() { return this._updatedAt; }
    get completed(){ return this.status === SubTaskStatus.COMPLETED}
}