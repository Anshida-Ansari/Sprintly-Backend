import { inject, injectable } from "inversify";
import { USER_TYPES } from "../../../../infrastructure/di/types/user/user.types";
import { IUserRepository } from "../../../../infrastructure/db/repository/interface/user.interface";
import { UserStatus } from "../../../../domain/enum/status.enum";
import { IListMembersUseCase } from "../interface/list.members.interface";

@injectable()
export class ListUserUseCase implements IListMembersUseCase {
  constructor(
    @inject(USER_TYPES.IUserRepository)
    private _userrepository: IUserRepository
  ) { }
  async execute(companyId: string, query: { page: number; limit: number; search?: string; }): Promise<{
    data: Array<{
      name: string;
      email: string;
      role: string;
      status: UserStatus;
    }>;
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {

    const { page, limit, search } = query
    const filter: any = { companyId }
    if (search) {
      filter.name = { $regex: search, $options: "i" }
    }

    const skip = (page - 1) * limit

    const [users, count] = await Promise.all([
      this._userrepository.find(filter, { skip, limit }),
      this._userrepository.count(filter)
    ])

    return {
      data: users.map((user) => ({
        name: user.name || "No Name",
        email: user.email,
        role: user.role,
        status: user.status || UserStatus.ACTIVE,

      })),
      total: count,
      page,
      limit,
      totalPages: Math.ceil(count / limit) || 1,
    };
  }
}