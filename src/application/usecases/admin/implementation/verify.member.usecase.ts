import { injectable } from "inversify";
import { ErrorMessage } from "@domain/enum/messages/error.message.enum";
import { redisClient } from "@infrastructure/providers/redis/redis.provider";
import { NotFoundError } from "@shared/utils/error-handling/errors/not.found.error";
import type { IVerifyInvitationUseCase } from "@application/usecases/admin/interface/verify.member.interface";

@injectable()
export class VerifyInvitationUseCase implements IVerifyInvitationUseCase {
	constructor() {}

	async execute(
		token: string,
	): Promise<{ name: string; email: string; companyId: string }> {
		const key = `member.invite:${token}`;

		const data = await redisClient.get(key);

		if (!data) {
			throw new NotFoundError(ErrorMessage.INVITATION_EXPIRED_OR_INVALID);
		}

		const parsed = JSON.parse(data);

		return {
			name: parsed.name,
			email: parsed.email,
			companyId: parsed.companyId,
		};
	}
}
