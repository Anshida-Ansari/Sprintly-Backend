import { UserEntity } from "../../domain/entities/user.entity";
import type { Role } from "../../domain/enum/role.enum";
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
	// biome-ignore lint/suspicious/noExplicitAny: MongoDB document type
	fromMongo(doc: any): UserEntity {
		return UserEntity.create({
			id: (doc._id as { toString(): string } | undefined)?.toString(),
			name: doc.name as string,
			email: doc.email as string,
			password: doc.password as string,
			role: doc.role as Role, // Role enum casting
			status: (doc.status ?? "active") as UserStatus,
			companyId: (
				doc.companyId as { toString(): string } | undefined
			)?.toString(),
			adminId: (doc.adminId as { toString(): string } | undefined)?.toString(),
			lastActive: doc.lastActive as Date,
			createdAt: doc.createdAt as Date,
		});
	}
}

export const UserMapper = new UserPersistenceMapper();
