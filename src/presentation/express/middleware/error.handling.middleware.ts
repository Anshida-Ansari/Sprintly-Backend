import { PinoLoggerService } from "@infrastructure/providers/logger/logger.service";
import type { NextFunction, Request, Response } from "express";
import { ServerErrorStatus } from "../../../domain/enum/status-codes/server.error.status.enum";
import AppError from "../../../shared/utils/error-handling/app.errors";
import { BaseError } from "../../../shared/utils/error-handling/base.error";

const logger = new PinoLoggerService();
export const errorMiddleware = (
	err: unknown,
	_req: Request,
	res: Response,
	_next: NextFunction,
) => {
	logger.error({
		message: "Error caught by middleware",
		error: err,
	});

	if (err instanceof AppError) {
		logger.warn({
			message: "Application error occurred",
			error: err.message,
			statusCode: err.statusCode,
		});
		return res.status(err.statusCode).json({
			status: false,
			message: err.message,
			data: err.data || null,
		});
	}

	if (err instanceof BaseError) {
		logger.warn({
			message: "Base error occurred",
			error: err.message,
			statusCode: err.statusCode,
		});
		return res.status(err.statusCode).json({
			status: false,
			message: err.message,
		});
	}
	logger.error({
		message: "Unhandled server error",
		error: err,
	});

	return res.status(ServerErrorStatus.INTERNAL_SERVER_ERROR).json({
		status: false,
		message: "Something went wrong.  Please try again later",
	});
};
