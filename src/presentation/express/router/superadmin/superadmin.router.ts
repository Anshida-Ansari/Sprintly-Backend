import { Router } from "express";
import { container } from "src/infrastructure/di/inversify.di";
import { ADMIN_TYPES } from "src/infrastructure/di/types/admin/admin.types";
import { SUPERADMIN_TYPES } from "src/infrastructure/di/types/superadmin/superadmin.types";
import { SuperAdminController } from "src/presentation/http/controllers/superadmin.controller";
import { AuthGurd } from "src/presentation/express/middleware/auth.gurd";

const router = Router()

const superadminController = container.get<SuperAdminController>(SUPERADMIN_TYPES.SuperAdminController)
const authGuard = container.get<AuthGurd>(ADMIN_TYPES.AuthGurd)

router.get('/companies',authGuard.authorize(['superadmin']),(req, res, next)=>superadminController.listCompanies(req, res, next))
router.patch('/company/:companyId/status',authGuard.authorize(['superadmin']),(req, res, next)=>superadminController.updateStatus(req, res, next))
router.get('/company/:companyId',authGuard.authorize(['superadmin']),(req, res, next)=>superadminController.getDetailPage(req, res, next))

export {router as superadminRouter}