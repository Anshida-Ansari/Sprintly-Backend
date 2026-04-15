import { ErrorMessage } from "@domain/enum/messages/error.message.enum";
import type { Role } from "@domain/enum/role.enum";
import { UserStatus } from "@domain/enum/status.enum";
import { hash } from "@shared/utils/password.hash.util";

export class UserEntity {
	private readonly _id?: string;
	private _name: string;
	private _email: string;
	private _password: string;
	private _role: Role;
	private _status: UserStatus;
	private _companyId?: string;
	private _adminId?: string;
	private _lastActive?: Date;
	private _createdAt?: Date;

	constructor(props: {
		id?: string;
		name: string;
		email: string;
		password: string;
		role: Role;
		status: UserStatus;
		companyId?: string;
		adminId?: string;
		lastActive?: Date;
		createdAt?: Date;
	}) {
		this._id = props.id;
		this._name = props.name;
		this._email = props.email;
		this._password = props.password;
		this._role = props.role;
		this._status = props.status;
		this._companyId = props.companyId;
		this._adminId = props.adminId;
		this._lastActive = props.lastActive;
		this._createdAt = props.createdAt;
	}

	static create(props: {
		id?: string;
		name: string;
		email: string;
		password: string;
		role: Role;
		status: UserStatus;
		companyId?: string;
		adminId?: string;
		lastActive?: Date;
		createdAt?: Date;
	}): UserEntity {
		return new UserEntity({
			id: props.id,
			name: props.name,
			email: props.email,
			password: props.password,
			role: props.role,
			status: props.status,
			companyId: props.companyId,
			adminId: props.adminId,
			lastActive: props.lastActive,
			createdAt: props.createdAt,
		});
	}

	get id() {
		return this._id;
	}
	get name() {
		return this._name;
	}
	get email() {
		return this._email;
	}
	get password() {
		return this._password;
	}
	get role() {
		return this._role;
	}
	get status() {
		return this._status;
	}
	get companyId() {
		return this._companyId;
	}
	get adminId() {
		return this._adminId;
	}
	get lastActive() {
		return this._lastActive;
	}
	get createdAt() {
		return this._createdAt;
	}

	isBlocked() {
		if (this._status === UserStatus.BLOCK) {
			throw new Error(ErrorMessage.ADMIN_BLOCKED);
		}
	}

	setPassword(newPassword: string) {
		this._password = newPassword;
	}

	async getHashedPassword() {
		return await hash(this.password);
	}
}
