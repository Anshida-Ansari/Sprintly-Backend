import type { IAiChatUseCase } from "@application/usecases/ai/interface/ai.chat.interface";
import { SuccessStatus } from "@domain/enum/status-codes/success.status.enum";
import { AI_TYPES } from "@infrastructure/di/types/ai/ai.types";
import type { NextFunction, Request, Response } from "express";
import { inject, injectable } from "inversify";

@injectable()
export class AiController {
	constructor(
		@inject(AI_TYPES.IAiChatUseCase)
		private readonly _aiChatUseCase: IAiChatUseCase,
	) {}

	async chat(req: Request, res: Response, next: NextFunction) {
		try {
			const { message } = req.body as { message: string };

			if (
				!message ||
				typeof message !== "string" ||
				message.trim().length === 0
			) {
				return res.status(400).json({
					success: false,
					message: "Message is required and must be a non-empty string",
				});
			}

			const reply = await this._aiChatUseCase.execute(message.trim());

			return res.status(SuccessStatus.OK).json({
				success: true,
				message: "AI response generated successfully",
				data: { reply },
			});
		} catch (error) {
			next(error);
		}
	}
}
