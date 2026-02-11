import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import type { NextFunction, Request, Response } from "express";
import { ClientErrorStatus } from "../../../domain/enum/status-codes/client.error.status.enum";
import { ServerErrorStatus } from "../../../domain/enum/status-codes/sever.error.status.enum";

export const validateDTO = (dtoClass: any) => {
	return async (req: Request, res: Response, next: NextFunction) => {
		try {
			const dtoInstance = plainToInstance(dtoClass, req.body, {
				excludeExtraneousValues: true,
				enableImplicitConversion: true,
			});

			const errors = await validate(dtoInstance, {
				whitelist: true,
				forbidNonWhitelisted: true,
				validationError: { target: false },
				skipMissingProperties: false,
			});

			if (errors.length > 0) {
				const message = errors
					.map((err) => Object.values(err.constraints || {}).join(", "))
					.join(", ");

				return res.status(ClientErrorStatus.BAD_REQUEST).json({
					message: message,
				});
			}

			req.body = dtoInstance;

			next();
		} catch (error) {
			const err = error as Error;
			return res
				.status(ServerErrorStatus.INTERNAL_SERVER_ERROR)
				.json(err.message);
		}
	};
};
