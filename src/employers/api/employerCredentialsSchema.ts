import {SchemaObject} from "@nestjs/swagger/dist/interfaces/open-api-spec.interface";

export const employerCredentialsSchema: SchemaObject = {
    type: "object",
    properties: {
        name: {
            type: "string"
        },
        email: {
            type: "string",
            format: "email"
        },
        company: {
            type: "string"
        }
    }
}