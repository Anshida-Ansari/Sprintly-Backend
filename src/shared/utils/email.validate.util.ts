import { validate } from "deep-email-validator";

export async function validateEmail(email: string): Promise<boolean> {
	const { valid } = await validate({
		email,
		validateRegex: true,
		validateMx: true,
		validateTypo: false,
		validateSMTP: false,
	});

	return valid;
}
