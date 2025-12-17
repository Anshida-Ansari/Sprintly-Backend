import { Router } from "express";
import { container } from "src/infrastructure/di/inversify.di";
import { ADMIN_TYPES } from "src/infrastructure/di/types/admin/admin.types";
import { SUPERADMIN_TYPES } from "src/infrastructure/di/types/superadmin/superadmin.types";
import { SuperAdminController } from "src/presentation/http/controllers/superadmin.controller";
import { AuthGurd } from "src/shared/middleware/auth.gurd";

const router = Router()

const superadminController = container.get<SuperAdminController>(SUPERADMIN_TYPES.SuperAdminController)
const authGuard = container.get<AuthGurd>(ADMIN_TYPES.AuthGurd)

router.get('/companies',authGuard.authorize(['superadmin']),(req,res)=>superadminController.listCompanies(req,res))
router.patch('/company/:companyId/status',authGuard.authorize(['superadmin']),(req,res)=>superadminController.updateStatus(req,res))
router.get('/company/:companyId',authGuard.authorize(['superadmin']),(req,res)=>superadminController.getDetailPage(req,res))

export {router as superadminRouter}