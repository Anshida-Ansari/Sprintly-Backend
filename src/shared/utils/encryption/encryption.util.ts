import * as crypto from "node:crypto";

export class  EncryptionUtil {
    private static readonly ALGORITHM = "aes-256-gcm";
    private static readonly IV_LENGTH = 16;
    private static readonly SALT_LENGTH = 64;
    private static readonly TAG_LENGTH = 16;
    private static readonly KEY_LENGTH = 32;


    static encrypt(text: string, secret: string): string {
   
            const salt = crypto.randomBytes(this.SALT_LENGTH);

            const key = crypto.pbkdf2Sync(
                secret,
                salt,
                100000,
                this.KEY_LENGTH,
                "sha512",
            );

            const iv = crypto.randomBytes(this.IV_LENGTH);

            const cipher = crypto.createCipheriv(this.ALGORITHM, key, iv);

            let encrypted = cipher.update(text, "utf8", "hex");
            encrypted += cipher.final("hex");

            const tag = cipher.getAuthTag();

            return `${salt.toString("hex")}:${iv.toString("hex")}:${encrypted}:${tag.toString("hex")}`;
       
    }

   
    static decrypt(encryptedData: string, secret: string): string {
      
            const parts = encryptedData.split(":");
            if (parts.length !== 4) {
                throw new Error("Invalid encrypted data format");
            }

            const salt = Buffer.from(parts[0], "hex");
            const iv = Buffer.from(parts[1], "hex");
            const encrypted = parts[2];
            const tag = Buffer.from(parts[3], "hex");

            const key = crypto.pbkdf2Sync(
                secret,
                salt,
                100000,
                this.KEY_LENGTH,
                "sha512",
            );

            const decipher = crypto.createDecipheriv(this.ALGORITHM, key, iv);
            decipher.setAuthTag(tag);

            let decrypted = decipher.update(encrypted, "hex", "utf8");
            decrypted += decipher.final("utf8");

            return decrypted;
       
    }
}
