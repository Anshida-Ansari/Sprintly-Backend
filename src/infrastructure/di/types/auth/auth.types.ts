import { SetPasswrodUseCase } from "src/application/usecases/auth/implementation/set.password";

export const AUTH_TYPES = {

userModel: Symbol.for('UserModel'),
CompanyModel: Symbol.for('CompanyModel'),
//controllers
AuthController: Symbol.for("AuthController"),

//interfaces

//UseCases
RegisterAdminUseCase: Symbol.for("RegisterAdminUseCase"),
LoginUseCase: Symbol.for("LoginUseCase"),
VerifyAdminOtpUseCase: Symbol.for("VerifyAdminOtpUseCase")  ,
RefreshUseCase: Symbol.for('RefreshUseCase'),
SetPasswrodUseCase: Symbol.for('SetPasswrodUseCase')
    
//Providers


}