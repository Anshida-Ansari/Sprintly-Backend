import { StandupEntity } from "@domain/entities/standup.entity";

export class StandupPersistanceMapper{
    toMongo(standup: StandupEntity){
        return{
            userId: standup.userId,
            projectId: standup.projectId,
            sprintId: standup.sprintId,
            companyId: standup.companyId,
            yesterday: standup.yesterday,
            today: standup.today,
            blockers: standup.blockers,
            comments: standup.comments,
            createdAt: standup.createdAt
                        
            
        }
    }

    fromMongo(doc:any): StandupEntity {
       return StandupEntity.create({
            id: doc._id.toString(),
            userId: doc.userId.toString(),
            projectId: doc.projectId.toString(),
            sprintId: doc.sprintId.toString(),
            companyId: doc.companyId.toString(),
            yesterday: doc.yesterday,
            today: doc.today,
            blockers: doc.blockers,
            comments: doc.comments,
            createdAt: doc.createdAt
        });
    }
}

