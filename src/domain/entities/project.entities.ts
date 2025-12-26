import { ProjectStatus } from "../enum/project/project.status";

export class ProjectEntity {
  private readonly _id?: string;
  private _name: string;
  private _description: string;
  private _status: ProjectStatus;
  private _startDate: Date;
  private _endDate: Date;
  private _createdBy: string;
  private _companyId: string;
  private _members: string[];
  private _gitRepoUrl?: string;
  private readonly _createdAt: Date;
  private _updatedAt?: Date;

  private constructor(props: {
    id?: string;
    name: string;
    description: string;
    status: ProjectStatus;
    startDate: Date;
    endDate: Date;
    createdBy: string;
    companyId: string;
    members?: string[];
    gitRepoUrl?: string;
    createdAt?: Date;
    updatedAt?: Date;
  }) {
    this._id = props.id;
    this._name = props.name;
    this._description = props.description;
    this._status = props.status;
    this._startDate = props.startDate;
    this._endDate = props.endDate;
    this._createdBy = props.createdBy;
    this._companyId = props.companyId;
    this._members = props.members || [];
    this._gitRepoUrl = props.gitRepoUrl;
    this._createdAt = props.createdAt || new Date();
    this._updatedAt = props.updatedAt;
  }

  static create(props: {
    id?: string,
    name: string;
    description: string;
    startDate: Date;
    endDate: Date;
    status: ProjectStatus;
    createdBy: string;
    companyId: string;
    members?: string[];
    gitRepoUrl?: string;
    createdAt?: Date;
    updatedAt?: Date;
  }): ProjectEntity {
    if (!props.name?.trim()) {
      throw new Error("Project name is required");
    }
    if (props.startDate > props.endDate) {
      throw new Error("Start date cannot be after end date");
    }

    return new ProjectEntity({
      ...props,
      name: props.name.trim(),
      description: props.description?.trim() || "",
      status: props.status || ProjectStatus.ACTIVE,
    });
  }

  update(props: Partial<{
    name: string;
    description: string;
    startDate: Date;
    endDate: Date;
    gitRepoUrl: string;
  }>) {
    if (props.name !== undefined) this._name = props.name.trim();
    if (props.description !== undefined) this._description = props.description?.trim();
    if (props.startDate !== undefined) this._startDate = props.startDate;
    if (props.endDate !== undefined) this._endDate = props.endDate;
    if (props.gitRepoUrl !== undefined) this._gitRepoUrl = props.gitRepoUrl;

    this._updatedAt = new Date();
  }


  addMember(userId: string) {
    if (!this._members.includes(userId)) {
      this._members.push(userId);
      this._updatedAt = new Date();
    }
  }

  completeProject() {
    this._status = ProjectStatus.COMPLETED;
    this._updatedAt = new Date();
  }

  get id() { return this._id; }
  get name() { return this._name; }
  get description() { return this._description; }
  get status() { return this._status; }
  get startDate() { return this._startDate; }
  get endDate() { return this._endDate; }
  get createdBy() { return this._createdBy; }
  get companyId() { return this._companyId; }
  get members() { return this._members; }
  get gitRepoUrl() { return this._gitRepoUrl; }
  get createdAt() { return this._createdAt; }
  get updatedAt() { return this._updatedAt; }
}
