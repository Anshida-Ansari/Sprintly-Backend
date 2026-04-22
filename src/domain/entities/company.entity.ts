import type { Status } from "@domain/enum/user/user.status.enum";

export interface GitHubCredentials {
	accessToken: string;
	refreshToken?: string;
	installationId?: string;
	username: string;
	organization?: string;
}

export class CompanyEntity {
	private readonly _id?: string;
	private _companyName: string;
	private _status: Status;
	private _adminId: string;
	private _createdAt?: Date;
	private _githubAccessToken?: string;
	private _githubRefreshToken?: string;
	private _githubInstallationId?: string;
	private _githubConnectedAt?: Date;
	private _githubUsername?: string;
	private _githubOrganization?: string;
	private _currentPlan: string;
	private _projectLimit: number;
	private _stripeCustomerId?: string;
	private _stripeSubscriptionId?: string;
	private _subscriptionEndDate?: Date;
	private _autoRenew: boolean;

	constructor(props: {
		id?: string;
		companyName: string;
		status: Status;
		adminId: string;
		createdAt?: Date;
		githubAccessToken?: string;
		githubRefreshToken?: string;
		githubInstallationId?: string;
		githubConnectedAt?: Date;
		githubUsername?: string;
		githubOrganization?: string;
		currentPlan: string;
		projectLimit: number;
		stripeCustomerId?: string;
		stripeSubscriptionId?: string;
		subscriptionEndDate?: Date;
		autoRenew?: boolean;
	}) {
		this._id = props.id;
		this._companyName = props.companyName;
		this._status = props.status;
		this._adminId = props.adminId;
		this._createdAt = props.createdAt;
		this._githubAccessToken = props.githubAccessToken;
		this._githubRefreshToken = props.githubRefreshToken;
		this._githubInstallationId = props.githubInstallationId;
		this._githubConnectedAt = props.githubConnectedAt;
		this._githubUsername = props.githubUsername;
		this._githubOrganization = props.githubOrganization;
		this._currentPlan = props.currentPlan;
		this._projectLimit = props.projectLimit;
		this._stripeCustomerId = props.stripeCustomerId;
		this._stripeSubscriptionId = props.stripeSubscriptionId;
		this._subscriptionEndDate = props.subscriptionEndDate;
		this._autoRenew = props.autoRenew ?? true;
	}

	static create(props: {
		id?: string;
		companyName: string;
		status: Status;
		adminId: string;
		createdAt?: Date;
		githubAccessToken?: string;
		githubRefreshToken?: string;
		githubInstallationId?: string;
		githubConnectedAt?: Date;
		githubUsername?: string;
		githubOrganization?: string;
		currentPlan?: string;
		projectLimit?: number;
		stripeCustomerId?: string;
		stripeSubscriptionId?: string;
		subscriptionEndDate?: Date;
		autoRenew?: boolean;
	}): CompanyEntity {
		const plan = props.currentPlan ?? "Free";
		const limit = props.projectLimit ?? 2; // Simple default fallback
		return new CompanyEntity({
			id: props.id,
			companyName: props.companyName,
			status: props.status,
			adminId: props.adminId,
			createdAt: props.createdAt,
			githubAccessToken: props.githubAccessToken,
			githubRefreshToken: props.githubRefreshToken,
			githubInstallationId: props.githubInstallationId,
			githubConnectedAt: props.githubConnectedAt,
			githubUsername: props.githubUsername,
			githubOrganization: props.githubOrganization,
			currentPlan: plan,
			projectLimit: limit,
			stripeCustomerId: props.stripeCustomerId,
			stripeSubscriptionId: props.stripeSubscriptionId,
			subscriptionEndDate: props.subscriptionEndDate,
			autoRenew: props.autoRenew,
		});
	}

	connectGitHub(credentials: GitHubCredentials): void {
		this._githubAccessToken = credentials.accessToken;
		this._githubRefreshToken = credentials.refreshToken;
		this._githubInstallationId = credentials.installationId;
		this._githubUsername = credentials.username;
		this._githubOrganization = credentials.organization;
		this._githubConnectedAt = new Date();
	}

	disconnectGitHub(): void {
		this._githubAccessToken = undefined;
		this._githubRefreshToken = undefined;
		this._githubInstallationId = undefined;
		this._githubUsername = undefined;
		this._githubOrganization = undefined;
		this._githubConnectedAt = undefined;
	}

	get isGitHubConnected(): boolean {
		return !!this._githubAccessToken;
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
	get githubAccessToken() {
		return this._githubAccessToken;
	}
	get githubRefreshToken() {
		return this._githubRefreshToken;
	}
	get githubInstallationId() {
		return this._githubInstallationId;
	}
	get githubConnectedAt() {
		return this._githubConnectedAt;
	}
	get githubUsername() {
		return this._githubUsername;
	}
	get githubOrganization() {
		return this._githubOrganization;
	}
	get currentPlan() {
		return this._currentPlan;
	}
	get projectLimit() {
		return this._projectLimit;
	}
	get stripeCustomerId() {
		return this._stripeCustomerId;
	}
	get stripeSubscriptionId() {
		return this._stripeSubscriptionId;
	}
	get subscriptionEndDate() {
		return this._subscriptionEndDate;
	}
	get autoRenew() {
		return this._autoRenew;
	}

	hasReachedProjectLimit(currentCount: number): boolean {
		// Always allow if the plan is Pro (case-insensitive)
		if (this._currentPlan.toLowerCase().includes("pro")) return false;
		if (this._projectLimit === -1) return false; // unlimited
		return currentCount >= this._projectLimit;
	}
}
