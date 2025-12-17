import { Router } from "express";
import { InviteMemberDTO } from "src/application/dtos/admin/invite.member.dto";
import { container } from "src/infrastructure/di/inversify.di";
import { ADMIN_TYPES } from "src/infrastructure/di/types/admin/admin.types";
import { AdminController } from "src/presentation/http/controllers/admin.controller";
import { AuthGurd } from "src/shared/middleware/auth.gurd";
import { validateDTO } from "src/shared/middleware/validate.dto.middlware";

const router = Router()

const adminController = container.get<AdminController>(ADMIN_TYPES.AdminController)
const authGuard = container.get<AuthGurd>(ADMIN_TYPES.AuthGurd);


router.post('/members/invite',authGuard.authorize(['admin']),validateDTO(InviteMemberDTO),(req,res)=>adminController.inviteMember(req,res))
router.post('/verify-members',(req,res)=>adminController.verifyInvitation(req,res))
router.get('/members',authGuard.authorize(['admin']),(req,res)=>adminController.listUsers(req,res))


export {router as adminRouter}