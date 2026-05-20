import {DataTypes, SchemaType} from "./schema";

export type InferType<S extends SchemaType> =
    S extends { type: DataTypes.STRING }
        ? string
        : S extends { type: DataTypes.NUMBER }
            ? number
            : S extends { type: DataTypes.BOOLEAN }
                ? boolean
                : S extends { type: DataTypes.BLOB }
                    ? Blob | Buffer
                    : S extends { type: DataTypes.ANY }
                        ? any
                        : S extends {
                                type: DataTypes.NULLABLE;
                                value: infer V extends SchemaType;
                            }
                            ? InferType<V> | null
                            : S extends {
                                    type: DataTypes.ARRAY;
                                    items: infer I extends SchemaType;
                                }
                                ? InferType<I>[]
                                : S extends {
                                        type: DataTypes.OBJECT;
                                        schema: infer O extends Record<
                                            string,
                                            SchemaType
                                        >;
                                    }
                                    ? {
                                        [K in keyof O]: InferType<O[K]>;
                                    }
                                    : never;