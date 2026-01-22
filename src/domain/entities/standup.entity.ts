export class StandupEntity {
    private _id?: string;
    private _userId: string;
    private _projectId: string;
    private _sprintId: string;
    private _companyId: string;
    private _yesterday: string;
    private _today: string;
    private _blockers: string;
    private _comments: Array<{
        userId: string
        userName: string,
        text: string,
        createdAt: Date
    }>
    private _createdAt: Date;
    private _userData?: { name: string; email: string; };

    private constructor(props: {
        id?: string;
        userId: string;
        projectId: string;
        sprintId: string;
        companyId: string;
        yesterday: string;
        today: string;
        blockers?: string;
        comments?: Array<{
            userId: string
            userName: string,
            text: string,
            createdAt: Date
        }>
        createdAt?: Date;
        userData?: { name: string; email: string; };
    }) {
        this._id = props.id;
        this._userId = props.userId;
        this._projectId = props.projectId;
        this._sprintId = props.sprintId;
        this._companyId = props.companyId;
        this._yesterday = props.yesterday.trim();
        this._today = props.today.trim();
        this._blockers = props.blockers?.trim() || "None";
        this._comments = props.comments ?? [];
        this._createdAt = props.createdAt ?? new Date();
        this._userData = props.userData;
    }

    static create(props: {
        id?: string;
        userId: string;
        projectId: string;
        sprintId: string;
        companyId: string;
        yesterday: string;
        today: string;
        blockers?: string;
        comments?: Array<{
            userId: string;
            userName: string;
            text: string;
            createdAt: Date;
        }>;
        createdAt?: Date;
        userData?: { name: string; email: string; };
    }): StandupEntity {
        if (!props.yesterday || !props.today) {
            throw new Error("Standup updates for Yesterday and Today are required");
        }
        return new StandupEntity(props);
    }

    update(props: Partial<{ yesterday: string; today: string; blockers: string }>) {
        if (props.yesterday !== undefined) this._yesterday = props.yesterday.trim();
        if (props.today !== undefined) this._today = props.today.trim();
        if (props.blockers !== undefined) this._blockers = props.blockers.trim();
    }

    addComment(userId: string, userName: string, text: string) {
        this._comments.push({
            userId,
            userName,
            text: text.trim(),
            createdAt: new Date()
        });
    }


    get id() { return this._id; }
    get userId() { return this._userId; }
    get projectId() { return this._projectId; }
    get sprintId() { return this._sprintId; }
    get companyId() { return this._companyId; }
    get yesterday() { return this._yesterday; }
    get today() { return this._today; }
    get blockers() { return this._blockers; }
    get comments() { return [...this._comments]; }
    get createdAt() { return this._createdAt; }
    get userData() { return this._userData; }

    toJSON() {
        return {
            _id: this._id,
            userId: this._userId,
            projectId: this._projectId,
            sprintId: this._sprintId,
            companyId: this._companyId,
            yesterday: this._yesterday,
            today: this._today,
            blockers: this._blockers,
            comments: this._comments,
            createdAt: this._createdAt,
            user: this._userData ? {
                _id: this._userId,
                name: this._userData.name,
                email: this._userData.email
            } : undefined
        }
    }
}