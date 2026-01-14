export const SUBTASK_TYPE = {
    SubTaskModel: Symbol.for('SubTaskModel'),
    SubTaskPersisitanceMapper: Symbol.for('SubTaskPersisitanceMapper'),
    ISubTaskRepository: Symbol.for('ISubTaskRepository'),
    ICreateSubTaskUseCase: Symbol.for('ICreateSubTaskUseCase'),
    SubTaskController: Symbol.for("SubTaskController"),
    IUpdateSubtaskStatusUseCase: Symbol.for("IUpdateSubtaskStatusUseCase"),
    IListSubtasksByStoryUseCase: Symbol.for("IListSubtasksByStoryUseCase")
    

}