import type { IListMembersUseCase } from "@application/usecases/admin/interface/list.members.interface";
import type { UserEntity } from "@domain/entities/user.entities";
import { UserStatus } from "@domain/enum/status.enum";
import type { IUserRepository } from "@infrastructure/db/repository/interface/user.interface";
import { USER_TYPES } from "@infrastructure/di/types/user/user.types";
import { inject, injectable } from "inversify";

@injectable()
export class ListUserUseCase implements IListMembersUseCase {
	constructor(
		@inject(USER_TYPES.IUserRepository)
		private _userrepository: IUserRepository,
	) {}
	async execute(
		companyId: string,
		query: { page: number; limit: number; search?: string },
	): Promise<{
		data: Array<{
			_id: string;
			name: string;
			email: string;
			role: string;
			status: UserStatus;
			createdAt: Date;
		}>;
		total: number;
		page: number;
		limit: number;
		totalPages: number;
	}> {
		const { page, limit, search } = query;
		const filter: Record<string, unknown> = { companyId };
		if (search) {
			filter.name = { $regex: search, $options: "i" };
		}

		const skip = (page - 1) * limit;

		const [users, count] = await Promise.all([
			this._userrepository.find(filter, { skip, limit }),
			this._userrepository.count(filter),
		]);

		return {
			data: users.map((user: UserEntity) => ({
				_id: user.id ?? "",
				name: user.name || "No Name",
				email: user.email,
				role: user.role,
				status: user.status || UserStatus.ACTIVE,
				createdAt: user.createdAt ?? new Date(),
			})),
			total: count,
			page,
			limit,
			totalPages: Math.ceil(count / limit) || 1,
		};
	}
}
