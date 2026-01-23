import { StandupEntity } from "@domain/entities/standup.entity";

export class StandupPersistanceMapper {
	toMongo(standup: StandupEntity) {
		return {
			userId: standup.userId,
			projectId: standup.projectId,
			sprintId: standup.sprintId,
			companyId: standup.companyId,
			yesterday: standup.yesterday,
			today: standup.today,
			blockers: standup.blockers,
			comments: standup.comments,
			createdAt: standup.createdAt,
		};
	}

	fromMongo(doc: any): StandupEntity {
		const user = doc.userId;
		const userId = user._id ? user._id.toString() : user.toString();

		return StandupEntity.create({
			id: doc._id.toString(),
			userId: userId,
			projectId: doc.projectId.toString(),
			sprintId: doc.sprintId.toString(),
			companyId: doc.companyId.toString(),
			yesterday: doc.yesterday,
			today: doc.today,
			blockers: doc.blockers,
			comments: doc.comments,
			createdAt: doc.createdAt,
			userData: user.name
				? {
						name: user.name,
						email: user.email,
					}
				: undefined,
		});
	}
}
