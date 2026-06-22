import { UserProfileEntity } from "@domain/entities/user.profile.entities";

export class UserProfilePersistenceMapper {
	toMongo(entity: UserProfileEntity) {
		return {
			userId: entity.userId,
			companyId: entity.companyId,
			phoneNumber: entity.phoneNumber,
			address: entity.address,
			bio: entity.bio,
			skills: entity.skills,
			avatarUrl: entity.avatarUrl,
			linkedin: entity.linkedin,
			github: entity.github,
			createdAt: entity.createdAt,
			updatedAt: entity.updatedAt,
		};
	}

	fromMongo(doc: any): UserProfileEntity {
		return UserProfileEntity.create({
			id: (doc._id as { toString(): string } | undefined)?.toString(),
			userId:
				(doc.userId as { toString(): string } | undefined)?.toString() ?? "",
			companyId: (doc.companyId as { toString(): string }).toString(),
			phoneNumber: doc.phoneNumber as string,
			address: doc.address as string,
			bio: doc.bio as string,
			skills: (doc.skills as string[]) ?? [],
			avatarUrl: doc.avatarUrl as string,
			linkedin: doc.linkedin as string,
			github: doc.github as string,
			createdAt: doc.createdAt as Date,
			updatedAt: doc.updatedAt as Date,
		});
	}
}
