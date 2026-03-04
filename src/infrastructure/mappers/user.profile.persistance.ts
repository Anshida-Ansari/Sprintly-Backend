import { UserProfileEntity } from "@domain/entities/user.profile.entities";

export class UserProfilePersistenceMapper{
    toMongo(entity: UserProfileEntity){
        return{
            userId: entity.userId,
			phoneNumber: entity.phoneNumber,
			address: entity.address,
			bio: entity.bio,
			skills: entity.skills,
			avatarUrl: entity.avatarUrl,
			linkedin: entity.linkedin,
			github: entity.github,
			createdAt: entity.createdAt,
			updatedAt: entity.updatedAt,
        }
    }

    fromMongo(doc:any):UserProfileEntity{
        return UserProfileEntity.create({
            id: doc._id?.toString(),
			userId: doc.userId?.toString(),
			phoneNumber: doc.phoneNumber,
			address: doc.address,
			bio: doc.bio,
			skills: doc.skills ?? [],
			avatarUrl: doc.avatarUrl,
			linkedin: doc.linkedin,
			github: doc.github,
			createdAt: doc.createdAt,
			updatedAt: doc.updatedAt,
        })
    }
}