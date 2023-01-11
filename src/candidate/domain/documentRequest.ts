export class DocumentRequest {
    constructor(
        public readonly categoryIdList: string[],
        public readonly employerId: string,
        public readonly note: string
    ) {}
}