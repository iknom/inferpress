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
    string: () => ({
        type: DataTypes.STRING,
    } as const),

    number: () => ({
        type: DataTypes.NUMBER,
    }) as const,

    boolean: () => ({
        type: DataTypes.BOOLEAN,
    }) as const,

    any: (): SchemaType => ({
        type: DataTypes.ANY,
    }),

    blob: (): SchemaType => ({
        type: DataTypes.BLOB,
    }),

    nullable: <
        T extends SchemaType
    >(
        value: T
    ): {
        type: DataTypes.NULLABLE;
        value: T;
    } => ({
        type: DataTypes.NULLABLE,
        value,
    }),

    array: <
        T extends SchemaType
    >(
        items: T
    ): {
        type: DataTypes.ARRAY;
        items: T;
    } => ({
        type: DataTypes.ARRAY,
        items,
    }),

    object: <
        T extends Record<string, SchemaType>
    >(
        schema: T
    ): {
        type: DataTypes.OBJECT;
        schema: T;
    } => ({
        type: DataTypes.OBJECT,
        schema,
    }),
};