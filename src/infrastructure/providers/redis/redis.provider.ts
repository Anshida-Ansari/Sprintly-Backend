import Redis from "ioredis";
import "dotenv/config";
import env from "../env/env.validation";
import { logger } from "../logger/pino.logger";

export const redisClient = new Redis({
	host: env.REDIS_HOST,
	port: Number(env.REDIS_PORT),
	password: env.REDIS_PASSWORD,
});
redisClient.on("reconnecting", () =>
	logger.warn({
		message: "Redis reconnecting...",
		service: "redis"
	})
);

redisClient.on("connect", () =>
	logger.info({
		message: "Redis Cloud connected",
		service: "redis"
	})
); redisClient.on("error", (error) =>
	logger.error({
		message: "Redis Connection Error",
		error
	})
);