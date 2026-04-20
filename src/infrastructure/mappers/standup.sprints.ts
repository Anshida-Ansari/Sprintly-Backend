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
			date: standup.date,
			comments: standup.comments,
			createdAt: standup.createdAt,
		};
	}

	// biome-ignore lint/suspicious/noExplicitAny: Raw database data requires 'any' for Mongoose Document compatibility
	fromMongo(doc: any): StandupEntity {
		const user = doc.userId as Record<string, unknown>;
		const userId =
			user && typeof user === "object" && "_id" in user
				? (user._id as { toString(): string }).toString()
				: (user as unknown as { toString(): string }).toString();

		return StandupEntity.create({
			id: (doc._id as { toString(): string }).toString(),
			userId: userId,
			projectId: (doc.projectId as { toString(): string }).toString(),
			sprintId: (doc.sprintId as { toString(): string }).toString(),
			companyId: (doc.companyId as { toString(): string }).toString(),
			yesterday: doc.yesterday as string,
			today: doc.today as string,
			blockers: doc.blockers as string,
			date: (doc.date as Date).toISOString(),
			comments:
				(doc.comments as Array<{
					userId: string;
					userName: string;
					text: string;
					createdAt: Date;
				}>) || [],
			createdAt: doc.createdAt as Date,
			userData:
				user && typeof user === "object" && "name" in user
					? {
							name: user.name as string,
							email: user.email as string,
						}
					: undefined,
		});
	}
}
