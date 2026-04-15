import { UserEntity } from "../../domain/entities/user.entities";
import type { UserStatus } from "../../domain/enum/status.enum";

export class UserPersistenceMapper {
	toMongo(user: UserEntity) {
		return {
			name: user.name,
			email: user.email,
			password: user.password,
			role: user.role,
			status: user.status,
			companyId: user.companyId,
			adminId: user.adminId,
			lastActive: user.lastActive,
		};
	}
	fromMongo(doc: any): UserEntity {
		return UserEntity.create({
			id: doc._id?.toString(),
			name: doc.name,
			email: doc.email,
			password: doc.password,
			role: doc.role,
			status: (doc.status ?? "active") as UserStatus,
			companyId: doc.companyId,
			adminId: doc.adminId,
			lastActive: doc.lastActive,
			createdAt: doc.createdAt,
		});
	}
}

export const UserMapper = new UserPersistenceMapper();
