export interface IVerifyForgotPasswordOtpUseCase {
    execute(email: string, otp: string): Promise<{ message: string }>;
}
