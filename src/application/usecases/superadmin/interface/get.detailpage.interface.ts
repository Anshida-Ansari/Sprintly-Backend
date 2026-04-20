export interface ICompanyDetail {
	_id?: string;
	companyName: string;
	status: string;
	adminId: string;
	createdAt?: Date;
	email: string;
}

export interface IGetDetailPageUseCase {
	execute(companyId: string): Promise<ICompanyDetail>;
}
