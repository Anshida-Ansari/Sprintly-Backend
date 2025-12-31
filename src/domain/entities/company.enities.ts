import type { Status } from "../enum/user/user.status.enum";

export class CompanyEnitiy {
	private readonly _id?: string;
	private _companyName: string;
	private _status: Status;
	private _adminId?: string;

	constructor(props: {
		id?: string;
		companyName: string;
		status: Status;
		adminId: string;
	}) {
		this._id = props.id;
		this._companyName = props.companyName;
		this._status = props.status;
		this._adminId = props.adminId;
	}

	static create(props: {
		id?: string;
		companyName: string;
		status: Status;
		adminId: string;
	}): CompanyEnitiy {
		return new CompanyEnitiy({
			id: props.id,
			companyName: props.companyName,
			status: props.status,
			adminId: props.adminId,
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
}
