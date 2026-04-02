export interface IAddAttachementsUseCase {
    execute(
        subTaskId: string,
        fileUrl: string,
        fileName: string,
        uploadedBy: string,
    ): Promise<void>
}