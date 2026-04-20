import * as crypto from "node:crypto";

const ALGORITHM = "aes-256-gcm";
const IV_LENGTH = 16;
const SALT_LENGTH = 64;
const KEY_LENGTH = 32;

export const EncryptionUtil = {
	encrypt(text: string, secret: string): string {
		const salt = crypto.randomBytes(SALT_LENGTH);

		const key = crypto.pbkdf2Sync(secret, salt, 100000, KEY_LENGTH, "sha512");

		const iv = crypto.randomBytes(IV_LENGTH);

		const cipher = crypto.createCipheriv(ALGORITHM, key, iv);

		let encrypted = cipher.update(text, "utf8", "hex");
		encrypted += cipher.final("hex");

		const tag = cipher.getAuthTag();

		return `${salt.toString("hex")}:${iv.toString("hex")}:${encrypted}:${tag.toString("hex")}`;
	},

	decrypt(encryptedData: string, secret: string): string {
		const parts = encryptedData.split(":");
		if (parts.length !== 4) {
			throw new Error("Invalid encrypted data format");
		}

		const salt = Buffer.from(parts[0], "hex");
		const iv = Buffer.from(parts[1], "hex");
		const encrypted = parts[2];
		const tag = Buffer.from(parts[3], "hex");

		const key = crypto.pbkdf2Sync(secret, salt, 100000, KEY_LENGTH, "sha512");

		const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);
		decipher.setAuthTag(tag);

		let decrypted = decipher.update(encrypted, "hex", "utf8");
		decrypted += decipher.final("utf8");

		return decrypted;
	},
};
