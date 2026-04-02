import { injectable } from "inversify";
import { S3Client, PutObjectCommand, DeleteObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { IStorageService, SignedUrlResponse } from "@domain/interface/storage.service.interface";
import { logger } from "../logger/pino.logger";
import { error } from "console";

@injectable()
export class StorageService implements IStorageService {
    private s3: S3Client;
    private bucketName: string;

    constructor() {
        const region = process.env.AWS_REGION;
        const accessKeyId = process.env.AWS_ACCESS_KEY_ID;
        const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;
        this.bucketName = process.env.AWS_BUCKET_NAME || "";

        if (!region || !accessKeyId || !secretAccessKey || !this.bucketName) {
            logger.error("FATAL ERROR: AWS Credentials or Region are missing in environment variables."); throw new Error("Missing AWS configuration for S3 client.");
        }

        this.s3 = new S3Client({
            region: region,
            credentials: {
                accessKeyId: accessKeyId,
                secretAccessKey: secretAccessKey,
            },
        });
    }

    async generateUploadSignedUrl(fileName: string, fileType: string): Promise<SignedUrlResponse> {
        const key = `attachments-image/${Date.now()}-${fileName}`;

        const command = new PutObjectCommand({
            Bucket: this.bucketName,
            Key: key,
            ContentType: fileType,
        });

        try {
            const uploadUrl = await getSignedUrl(this.s3, command, { expiresIn: 300 });
            const fileUrl = `https://${this.bucketName}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;

            return { uploadUrl, fileUrl };
        } catch (error) {
            logger.error({ err: error }, "S3 Generate Signed URL failed"); throw error;
        }
    }

    async deleteFile(fileUrl: string): Promise<void> {
        try {
            const url = new URL(fileUrl);
            const key = decodeURIComponent(url.pathname.slice(1));

            const command = new DeleteObjectCommand({
                Bucket: this.bucketName,
                Key: key,
            });

            await this.s3.send(command);
            logger.info(`Successfully deleted file from S3: ${key}`);

        } catch (error) {
            logger.error({ err: error }, "Error deleting file from S3:");
        }
    }

    async generateDownloadSignedUrl(fileUrl: string): Promise<string> {
        try {
            const url = new URL(fileUrl);
            const key = decodeURIComponent(url.pathname.slice(1));

            const command = new GetObjectCommand({
                Bucket: this.bucketName,
                Key: key,
            });

            const downloadUrl = await getSignedUrl(this.s3, command, { expiresIn: 300 });
            return downloadUrl;
        } catch (error) {
            logger.error({ err: error }, "S3 Generate Download Signed URL failed"); throw error;
        }
    }
}
