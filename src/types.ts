import {DataTypes, SchemaType} from "./schema";

export type InferType<S> =

    S extends { type: DataTypes.STRING }
        ? string

        : S extends { type: DataTypes.NUMBER }
            ? number

            : S extends { type: DataTypes.BOOLEAN }
                ? boolean

                : S extends {
                        type: DataTypes.NULLABLE;
                        value: infer V;
                    }
                    ? InferType<V> | null

                    : S extends {
                            type: DataTypes.ARRAY;
                            items: infer I;
                        }
                        ? InferType<I>[]

                        : S extends {
                                type: DataTypes.OBJECT;
                                schema: infer O;
                            }
                            ? {
                                [K in keyof O]:
                                InferType<O[K]>
                            }

                            : never;