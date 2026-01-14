export interface IDeleteSubtaskUseCase {
    execute(subtaskId: string, companyId: string): Promise<void>;
}