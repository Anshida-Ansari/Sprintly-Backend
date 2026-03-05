import { UpdateUserProfileDTO } from "@application/dtos/userprofie/update.profile";
import { container } from "@infrastructure/di/inversify.di";
import { ADMIN_TYPES } from "@infrastructure/di/types/admin/admin.types";
import { USER_PROFILE_TYPE } from "@infrastructure/di/types/userprofile/user.profile";
import { AuthGurd } from "@presentation/express/middleware/auth.gurd";
import { validateDTO } from "@presentation/express/middleware/validate.dto.middlware";
import { UserProfileController } from "@presentation/http/controllers/user.profile.controller";
import { USER_PROFILE } from "@shared/constants/user.profile.constants";
import { Router } from "express";

const router = Router()
const userprofileController = container.get<UserProfileController>(
    USER_PROFILE_TYPE.UserProfileController
)

const authGurd = container.get<AuthGurd>(ADMIN_TYPES.AuthGurd)

router.put(
    USER_PROFILE.UPDATE_USER_PROFILE,
    authGurd.authorize(['admin','lead','developer']),
    validateDTO(UpdateUserProfileDTO),
    (req,res,next) => userprofileController.updateProfile(req,res,next)
)

export {router as userprofileRotuer}