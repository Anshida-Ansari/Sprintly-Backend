import { UserProfileModel } from "@infrastructure/db/models/user.profile.model";

export const USER_PROFILE_TYPE = {
    UserProfileModel:Symbol.for('UserProfileModel'),
    IUserProfileRepository: Symbol.for('IUserProfileRepository'),
    UserProfilePersistenceMapper: Symbol.for('UserProfilePersistenceMapper')

}