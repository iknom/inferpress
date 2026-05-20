export enum DataTypes {
    STRING = "string",
    NUMBER = "number",
    BOOLEAN = "boolean",
    OBJECT = "object",
    NULLABLE = "nullable",
    ARRAY = "array",
    BLOB = "blob",
    ANY = "any",
}

export type SchemaType =
    | { type: DataTypes.STRING }
    | { type: DataTypes.NUMBER }
    | { type: DataTypes.BOOLEAN }
    | { type: DataTypes.BLOB }
    | { type: DataTypes.ANY }
    | {
    type: DataTypes.NULLABLE;
    value: SchemaType;
}
    | {
    type: DataTypes.ARRAY;
    items: SchemaType;
}
    | {
    type: DataTypes.OBJECT;
    schema: Record<string, SchemaType>;
};

export const v = {
    string: (): SchemaType => ({
        type: DataTypes.STRING,
    }),

    number: (): SchemaType => ({
        type: DataTypes.NUMBER,
    }),

    boolean: (): SchemaType => ({
        type: DataTypes.BOOLEAN,
    }),

    any: (): SchemaType => ({
        type: DataTypes.ANY,
    }),

    blob: (): SchemaType => ({
        type: DataTypes.BLOB,
    }),

    nullable: (value: SchemaType): SchemaType => ({
        type: DataTypes.NULLABLE,
        value,
    }),

    array: (items: SchemaType): SchemaType => ({
        type: DataTypes.ARRAY,
        items,
    }),

    object: (
        schema: Record<string, SchemaType>
    ): SchemaType => ({
        type: DataTypes.OBJECT,
        schema,
    }),
};