export interface IGenerateDownloadUrlUseCase {
	execute(fileUrl: string): Promise<string>;
}
