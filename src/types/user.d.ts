export type CollectionField = {
    name: string;
    type: "string" | "number" | "email" | "string"[];
    required: boolean;
    maxValue?: number;
    minValue?: number;
    minLength?: number;
    maxLength?: number;
}

export type Collection = {
    name: string,
    fields: CollectionField[]
}

export type User = {
    password: string,
    email: string,
    _id: string;
    createdAt: string,
    updatedAt: string,
    collections: Collection[]
}