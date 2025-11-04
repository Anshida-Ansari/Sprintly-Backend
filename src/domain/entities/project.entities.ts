export class Project {
  public readonly id?: string;
  public name: string;
  public description: string;
  public status: string;
  public startDate: Date;
  public endDate: Date;
  public members: string[];
  public gitRepoUrls: string[];
  public readonly createdAt?: Date;
  public readonly updatedAt?: Date;

  constructor(
    name: string,
    description: string,
    status: string,
    startDate: Date,
    endDate: Date,
    members: string[],
    gitRepoUrls: string[],
    id?: string,
    createdAt?: Date,
    updatedAt?: Date
  ) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.status = status;
    this.startDate = startDate;
    this.endDate = endDate;
    this.members = members;
    this.gitRepoUrls = gitRepoUrls;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }
}