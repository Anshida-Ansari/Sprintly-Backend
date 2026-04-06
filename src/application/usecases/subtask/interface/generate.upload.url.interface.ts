export interface IGenerateUploadURLUseCase {
	execute(
		fileName: string,
		fileType: string,
	): Promise<{
		uploadUrl: string;
		fileUrl: string;
	}>;
}
