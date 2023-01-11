export interface TokenRepository {
    getData<T>(token: string, type?: string): Promise<T>;
}