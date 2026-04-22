export class SubscriptionPlanEntity {
	private readonly _id?: string;
	private _name: string;
	private _price: number;
	private _stripePriceId?: string;
	private _projectLimit: number;
	private _features: Array<{ text: string; included: boolean }>;
	private _isActive: boolean;
	private _isPopular: boolean;
	private readonly _createdAt?: Date;
	private readonly _updatedAt?: Date;

	constructor(props: {
		id?: string;
		name: string;
		price: number;
		stripePriceId?: string;
		projectLimit: number;
		features?: Array<{ text: string; included: boolean }>;
		isActive?: boolean;
		isPopular?: boolean;
		createdAt?: Date;
		updatedAt?: Date;
	}) {
		this._id = props.id;
		this._name = props.name;
		this._price = props.price;
		this._stripePriceId = props.stripePriceId;
		this._projectLimit = props.projectLimit;
		this._features = props.features ?? [];
		this._isActive = props.isActive ?? true;
		this._isPopular = props.isPopular ?? false;
		this._createdAt = props.createdAt;
		this._updatedAt = props.updatedAt;
	}

	static create(props: Omit<ConstructorParameters<typeof SubscriptionPlanEntity>[0], "id" | "createdAt" | "updatedAt">): SubscriptionPlanEntity {
		return new SubscriptionPlanEntity(props);
	}

	get id() { return this._id; }
	get name() { return this._name; }
	get price() { return this._price; }
	get stripePriceId() { return this._stripePriceId; }
	get projectLimit() { return this._projectLimit; }
	get features() { return this._features; }
	get isActive() { return this._isActive; }
	get isPopular() { return this._isPopular; }
	get createdAt() { return this._createdAt; }
	get updatedAt() { return this._updatedAt; }
}
