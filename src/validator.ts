import { Response } from "express";
import { DataTypes, SchemaType } from "./schema";

function isBlob(val: unknown): boolean {
    return typeof Blob !== "undefined" && val instanceof Blob;
}

function isNodeBuffer(val: unknown): boolean {
    return typeof Buffer !== "undefined" &&
        !!val &&
        Buffer.isBuffer(val);
}

export default function validator(
    value: any,
    schema: SchemaType,
): any {

    switch (schema.type) {

        case DataTypes.ANY:
            return value;

        case DataTypes.STRING:
            return String(value);

        case DataTypes.NUMBER: {
            const num = Number(value);

            if (Number.isNaN(num)) {
                throw new Error("Expected number");
            }

            return num;
        }

        case DataTypes.BOOLEAN: {

            if (typeof value === "boolean") {
                return value;
            }

            if (typeof value === "string") {

                const v = value.toLowerCase();

                if (v === "true" || v === "1") {
                    return true;
                }

                if (v === "false" || v === "0") {
                    return false;
                }
            }

            throw new Error("Expected boolean");
        }

        case DataTypes.BLOB:

            if (
                isBlob(value) ||
                isNodeBuffer(value)
            ) {
                return value;
            }

            throw new Error("Expected blob");

        case DataTypes.NULLABLE:

            if (
                value === null ||
                value === undefined ||
                value === ""
            ) {
                return null;
            }

            return validator(
                value,
                schema.value
            );

        case DataTypes.ARRAY:

            if (!Array.isArray(value)) {
                throw new Error("Expected array");
            }

            return value.map(item =>
                validator(item, schema.items)
            );

        case DataTypes.OBJECT:

            if (
                typeof value !== "object" ||
                value === null ||
                Array.isArray(value)
            ) {
                throw new Error("Expected object");
            }

            const result: Record<string, any> = {};

            for (const key in schema.schema) {

                result[key] = validator(
                    value[key],
                    schema.schema[key]
                );

            }

            return result;
    }
}