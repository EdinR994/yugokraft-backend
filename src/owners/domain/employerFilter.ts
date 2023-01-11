export interface EmployerFilter {
    onlyActive: boolean,
    nameOrCompany: string,
    registrationDate: {
        from: Date,
        to: Date
    },
    interviewed: {
        from: number,
        to: number
    },
    hired: {
        from: number,
        to: number
    },
    size: number,
    page: number
}