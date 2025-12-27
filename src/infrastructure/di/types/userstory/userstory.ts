import { UserStoryModel } from "src/infrastructure/db/models/userstory.model";
import { UserStoryPersisitanceMapper } from "src/infrastructure/mappers/userstrory.mapper";

export const USERSTORY_TYPE = {
    UserStoryModel: Symbol.for("UserStoryModel"),
    UserStoryPersisitanceMapper: Symbol.for("UserStoryPersisitanceMapper"),
    IUserStroyRepository: Symbol.for("IUserStroyRepository")

}