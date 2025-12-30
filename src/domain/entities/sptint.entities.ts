import { SprintStatus } from "../enum/sprints/sprints.status";


export class SprintEntity {
    private _id?: string;
    private _projectId: string;
    private _companyId: string;
    private _name: string;
    private _goal?: string;
    private _startDate: Date;
    private _endDate: Date;
    private _status: SprintStatus;
    private _createdAt: Date;
    private _updatedAt: Date;

    private constructor(props: {
        id?: string;
        projectId: string;
        companyId: string;
        name: string;
        goal?: string;
        startDate: Date;
        endDate: Date;
        status?: SprintStatus;
        createdAt?: Date;
        updatedAt?: Date;
    }) {
        this._id = props.id;
        this._projectId = props.projectId;
        this._companyId = props.companyId;
        this._name = props.name.trim();
        this._goal = props.goal?.trim();
        this._startDate = props.startDate;
        this._endDate = props.endDate;
        this._status = props.status ?? SprintStatus.PLANNED;
        this._createdAt = props.createdAt ?? new Date();
        this._updatedAt = props.updatedAt ?? new Date();
    }

    static create(props: {
        id?: string;
        projectId: string;
        companyId: string;
        name: string;
        goal?: string;
        startDate: Date;
        endDate: Date;
        status?: SprintStatus;
        createdAt?: Date;
        updatedAt?: Date;
    }): SprintEntity {
        if (props.startDate >= props.endDate) {
            throw new Error("Sprint end date must be after start date");
        }
        return new SprintEntity(props);
    }

    start() {
        if (this._status !== SprintStatus.PLANNED) {
            throw new Error("Only planned sprints can be started");
        }
        this._status = SprintStatus.ACTIVE;
        this._updatedAt = new Date();
    }

    complete() {
        if (this._status !== SprintStatus.ACTIVE) {
            throw new Error("Only active sprints can be completed");
        }
        this._status = SprintStatus.COMPLETED;
        this._updatedAt = new Date();
    }

    update(props: Partial<{
        name: string;
        goal?: string;
        startDate: Date;
        endDate: Date;
        status?: SprintStatus;
        updatedAt?: Date;
    }>) {
        if (props.name !== undefined) this._name = props.name.trim();
        if (props.goal !== undefined) this._goal = props.goal?.trim();
        if (props.startDate !== undefined) this._startDate = props.startDate;
        if (props.endDate !== undefined) this._endDate = props.endDate;

        if (this._startDate >= this._endDate) {
            throw new Error("Sprint end date must be after start date");
        }

        this._updatedAt = new Date();
    }


    get id() { return this._id; }
    get projectId() { return this._projectId; }
    get companyId() { return this._companyId; }
    get name() { return this._name; }
    get goal() { return this._goal; }
    get startDate() { return this._startDate; }
    get endDate() { return this._endDate; }
    get status() { return this._status; }
    get createdAt() { return this._createdAt; }
    get updatedAt() { return this._updatedAt; }
}
