import { UserStoryEntity } from "src/domain/entities/user.story.entities";

export class UserStoryPersisitanceMapper {
    toMongo(userStory: UserStoryEntity){
        return{
            _id: userStory.id,
            projectId: userStory.projectId,
            companyId: userStory.companyId,
            title: userStory.title,
            description: userStory.description,
            status: userStory.status,
            priority: userStory.priority,
            sprintId: userStory.sprintId,
            createdAt: userStory.createdAt,
            updatedAt: userStory.updatedAt
        }
    }

    fromMongo(doc:any):UserStoryEntity {
        return UserStoryEntity.create({
            id: doc._id.toString(),
            projectId: doc.projectId.toString(),
            companyId: doc.companyId.toString(),
            title: doc.title,
            description: doc.description,
            priority: doc.priority,
            sprintId: doc.sprintId?.toString(),
        })
    }
}