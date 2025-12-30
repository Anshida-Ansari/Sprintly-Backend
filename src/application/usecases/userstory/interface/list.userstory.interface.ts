export interface IListUserstoryUseCase {
  execute(
    query: {
      page: number
      limit: number
      search?: string
      sprintId?: string
      status?: string
    },
    companyId: string,
    projectId: string
  ): Promise<{
    data: any[]
    total: number
    page: number
    limit: number
    totalPages: number
  }>
}
