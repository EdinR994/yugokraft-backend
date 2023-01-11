export interface DocumentRepository {
    fulfillRequest(requestId: string): Promise<boolean>;
    saveRequest(candidateId: string, employerId: string): Promise<string>;
    getCategoriesInIdList(idList: string[]): Promise<string[]>
}