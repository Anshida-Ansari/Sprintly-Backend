import type { Status } from "@domain/enum/user/user.status.enum";

export class CompanyEnitiy {
	private readonly _id?: string;
	private _companyName: string;
	private _status: Status;
	private _adminId: string;
	private _createdAt?: Date;

	constructor(props: {
		id?: string;
		companyName: string;
		status: Status;
		adminId: string;
		createdAt?: Date;
	}) {
		this._id = props.id;
		this._companyName = props.companyName;
		this._status = props.status;
		this._adminId = props.adminId;
		this._createdAt = props.createdAt;
	}

	static create(props: {
		id?: string;
		companyName: string;
		status: Status;
		adminId: string;
		createdAt?: Date;
	}): CompanyEnitiy {
		return new CompanyEnitiy({
			id: props.id,
			companyName: props.companyName,
			status: props.status,
			adminId: props.adminId,
			createdAt: props.createdAt,
		});
	}

	get id() {
		return this._id;
	}
	get companyName() {
		return this._companyName;
	}
	get status() {
		return this._status;
	}
	get adminId() {
		return this._adminId;
	}
	get createdAt() {
		return this._createdAt;
	}
}
