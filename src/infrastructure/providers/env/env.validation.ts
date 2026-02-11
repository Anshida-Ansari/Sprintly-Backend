import "./load.env";
import { z } from "zod";

const envSchema = z.object({
	PORT: z.string().transform(Number),
	MONGO_URI: z.string().nonempty(),
	REDIS_HOST: z.string().nonempty(),
	REDIS_PORT: z.string().transform(Number),
	REDIS_PASSWORD: z.string().nonempty(),
	EMAIL_USER: z.string().nonempty(),
	EMAIL_PASS: z.string().nonempty(),
	ACCESS_TOKEN_SECERET: z.string().nonempty(),
	REFRESH_TOKEN_SECERET: z.string().nonempty(),
	ACCESS_TOKEN_MAX_AGE: z.string().transform(Number),
	REFRESH_TOKEN_MAX_AGE: z.string().transform(Number),

	FRONTENT_URL: z.string().url(),
});

const env = envSchema.parse(process.env);

export default env;
