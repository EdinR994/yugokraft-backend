export interface ReadModelRepository {
    getCandidateById(id: string, employerId: string): Promise<any>
}