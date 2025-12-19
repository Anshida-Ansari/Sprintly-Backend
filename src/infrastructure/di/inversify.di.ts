import { Container } from "inversify";
import { AuthModule } from "./container/auth/auth.modules";
import { UserModule } from "./container/user/user.modules";
import { CompanyModule } from "./container/company/company.modules";
import { InviteModule } from "./container/admin/admin.modules";
import { SuperAdminModule } from "./container/superadmin/superadmin.modules";
import { ProjectModule } from "./container/project/project.modules";

const container = new Container({
    defaultScope:"Singleton",
    autobind:true
})

container.load(
    AuthModule,
    UserModule,
    CompanyModule,
    InviteModule,
    SuperAdminModule,
    ProjectModule

)

export {container}