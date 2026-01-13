export class SubTaskEntity {
    private readonly _id?: string;
    private _userStoryId: string;
    private _companyId: string; // Added underscore to match your convention
    private _title: string;
    private _isDone: boolean;
    private _assignedTo?: string;
    private readonly _createdAt: Date;
    private _updatedAt?: Date;

    private constructor(props: {
        id?: string;
        userStoryId: string;
        companyId: string; // Required in constructor
        title: string;
        isDone: boolean;
        assignedTo?: string;
        createdAt?: Date;
        updatedAt?: Date;
    }) {
        this._id = props.id;
        this._userStoryId = props.userStoryId;
        this._companyId = props.companyId;
        this._title = props.title;
        this._isDone = props.isDone;
        this._assignedTo = props.assignedTo;
        this._createdAt = props.createdAt || new Date();
        this._updatedAt = props.updatedAt;
    }

    static create(props: {
        id?: string;
        userStoryId: string;
        companyId: string; // Make sure this is passed from the Use Case
        title: string;
        isDone?: boolean; // Optional here so Mapper can pass existing status
        assignedTo?: string;
    }): SubTaskEntity {
        if (!props.title?.trim()) throw new Error("Sub-task title is required");
        if (!props.userStoryId) throw new Error("User Story ID is required");
        if (!props.companyId) throw new Error("Company ID is required");

        return new SubTaskEntity({
            ...props,
            title: props.title.trim(),
            isDone: props.isDone ?? false, // Defaults to false for new ones
            assignedTo: props.assignedTo,
        });
    }

    update(props: Partial<{
        title: string;
        isDone: boolean;
        assignedTo: string;
    }>) {
        if (props.title !== undefined) this._title = props.title.trim();
        if (props.isDone !== undefined) this._isDone = props.isDone;
        if (props.assignedTo !== undefined) this._assignedTo = props.assignedTo;

        this._updatedAt = new Date();
    }

    // Getters
    get id() { return this._id; }
    get userStoryId() { return this._userStoryId; }
    get companyId() { return this._companyId; } // Needed for the Mapper
    get title() { return this._title; }
    get isDone() { return this._isDone; }
    get assignedTo() { return this._assignedTo; }
    get createdAt() { return this._createdAt; }
    get updatedAt() { return this._updatedAt; }
}