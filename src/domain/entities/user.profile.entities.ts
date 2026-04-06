export class UserProfileEntity {
	private readonly _id?: string;
	private readonly _userId: string;
	private readonly _companyId: string;
	private _phoneNumber?: string;
	private _address?: string;
	private _bio?: string;
	private _skills: string[];
	private _avatarUrl?: string;
	private _linkedin?: string;
	private _github?: string;
	private readonly _createdAt?: Date;
	private _updatedAt?: Date;

	constructor(props: {
		id?: string;
		userId: string;
		companyId: string;
		phoneNumber?: string;
		address?: string;
		bio?: string;
		skills?: string[];
		avatarUrl?: string;
		linkedin?: string;
		github?: string;
		createdAt?: Date;
		updatedAt?: Date;
	}) {
		this._id = props.id;
		this._userId = props.userId;
		this._companyId = props.companyId;
		this._phoneNumber = props.phoneNumber;
		this._address = props.address;
		this._bio = props.bio;
		this._skills = props.skills ?? [];
		this._avatarUrl = props.avatarUrl;
		this._linkedin = props.linkedin;
		this._github = props.github;
		this._createdAt = props.createdAt;
		this._updatedAt = props.updatedAt;

		this.validate();
	}

	static create(props: {
		id?: string;
		userId: string;
		companyId: string;
		phoneNumber?: string;
		address?: string;
		bio?: string;
		skills?: string[];
		avatarUrl?: string;
		linkedin?: string;
		github?: string;
		createdAt?: Date;
		updatedAt?: Date;
	}): UserProfileEntity {
		return new UserProfileEntity(props);
	}

	private validate() {
		if (!this._userId) {
			throw new Error("UserId is required");
		}

		if (!this._companyId) {
			throw new Error("CompanyId is required");
		}

		if (this._bio && this._bio.length > 500) {
			throw new Error("Bio cannot exceed 500 characters");
		}

		if (this._skills.length > 20) {
			throw new Error("Skills cannot exceed 20 items");
		}

		const uniqueSkills = new Set(this._skills);
		if (uniqueSkills.size !== this._skills.length) {
			throw new Error("Duplicate skills are not allowed");
		}
	}

	get id() {
		return this._id;
	}
	get userId() {
		return this._userId;
	}
	get companyId() {
		return this._companyId;
	}
	get phoneNumber() {
		return this._phoneNumber;
	}
	get address() {
		return this._address;
	}
	get bio() {
		return this._bio;
	}
	get skills() {
		return this._skills;
	}
	get avatarUrl() {
		return this._avatarUrl;
	}
	get linkedin() {
		return this._linkedin;
	}
	get github() {
		return this._github;
	}
	get createdAt() {
		return this._createdAt;
	}
	get updatedAt() {
		return this._updatedAt;
	}

	updateProfile(props: {
		phoneNumber?: string;
		address?: string;
		bio?: string;
		skills?: string[];
		avatarUrl?: string;
		linkedin?: string;
		github?: string;
	}) {
		if (props.phoneNumber !== undefined) this._phoneNumber = props.phoneNumber;

		if (props.address !== undefined) this._address = props.address;

		if (props.bio !== undefined) this._bio = props.bio;

		if (props.skills !== undefined) this._skills = props.skills;

		if (props.avatarUrl !== undefined) this._avatarUrl = props.avatarUrl;

		if (props.linkedin !== undefined) this._linkedin = props.linkedin;

		if (props.github !== undefined) this._github = props.github;

		this._updatedAt = new Date();

		this.validate();
	}
}
