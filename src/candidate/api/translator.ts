export interface Translator {
    translateCandidate<T>(data: T): Promise<T>;
}