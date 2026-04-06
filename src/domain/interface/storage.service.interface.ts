export interface SignedUrlResponse {
	uploadUrl: string;
	fileUrl: string;
}

export interface IStorageService {
	generateUploadSignedUrl(
		fileName: string,
		fileType: string,
	): Promise<SignedUrlResponse>;
	generateDownloadSignedUrl(fileUrl: string): Promise<string>;
	deleteFile(fileUrl: string): Promise<void>;
}
