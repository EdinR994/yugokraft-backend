export interface DomainEvent<T> {
    name: string,
    data: T,
    component?: string
}