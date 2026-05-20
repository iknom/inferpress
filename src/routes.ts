import {
    Request,
    Response,
    NextFunction
} from "express";

import validator from "./validator";
import { InferType } from "./types";
import { SchemaType } from "./schema";

interface RouteSchema {
    body?: SchemaType;
    query?: SchemaType;
    params?: SchemaType;
}

type InferRequest<T extends RouteSchema> = {
    body: T["body"] extends SchemaType
        ? InferType<T["body"]>
        : undefined;

    query: T["query"] extends SchemaType
        ? InferType<T["query"]>
        : undefined;

    params: T["params"] extends SchemaType
        ? InferType<T["params"]>
        : undefined;
};

function toPlain(data: any): any {

    if (!data) {
        return data;
    }

    if (Array.isArray(data)) {
        return data.map(toPlain);
    }

    if (typeof data.toJSON === "function") {
        return data.toJSON();
    }

    if (typeof data.get === "function") {
        return data.get({ plain: true });
    }

    return data;
}

export function createValidation<UserType>(config: {
    authenticate?: (
        req: Request,
        res: Response
    ) => Promise<UserType | null>;
}) {

    function publicRoute<T extends RouteSchema>(
        schema: T,
        endpoint: (
            data: InferRequest<T> & {
                req: Request;
                res: Response;
            }
        ) => Promise<any>
    ) {

        return async (req: Request, res: Response,) => {

            try {

                const data = {
                    body: schema.body
                        ? validator(
                            req.body,
                            schema.body
                        )
                        : undefined,

                    query: schema.query
                        ? validator(
                            req.query,
                            schema.query
                        )
                        : undefined,

                    params: schema.params
                        ? validator(
                            req.params,
                            schema.params
                        )
                        : undefined,
                };

                const result = await endpoint({
                    ...data,
                    req,
                    res,
                });

                if (res.headersSent) {
                    return;
                }

                if (result === undefined) {
                    return res.status(200).json({
                        success: true,
                        data: null,
                    });
                }

                return res.json(
                    toPlain(result)
                );

            } catch (e: any) {

                return res.status(400).json({
                    success: false,
                    error: e.message,
                });

            }

        };
    }

    function privateRoute<T extends RouteSchema>(
        schema: T,
        endpoint: (
            data: InferRequest<T> & {
                req: Request;
                res: Response;
                user: UserType;
            }
        ) => Promise<any>
    ) {
        return async (req: Request, res: Response,) => {
            if (!config.authenticate) {
                throw new Error(
                    "authenticate function is required for privateRoute"
                );
            }

            try {
                const user = await config.authenticate(req, res);
                if (!user) return;

                const data = {
                    body: schema.body
                        ? validator(
                            req.body,
                            schema.body
                        )
                        : undefined,

                    query: schema.query
                        ? validator(
                            req.query,
                            schema.query
                        )
                        : undefined,

                    params: schema.params
                        ? validator(
                            req.params,
                            schema.params
                        )
                        : undefined,
                };

                const result = await endpoint({
                    ...data,
                    req,
                    res,
                    user,
                });

                if (res.headersSent) {
                    return;
                }

                if (result === undefined) {
                    return res.status(200).json({
                        success: true,
                        data: null,
                    });
                }

                return res.json(
                    toPlain(result)
                );

            } catch (e: any) {

                return res.status(400).json({
                    success: false,
                    error: e.message,
                });

            }

        };
    }

    return {
        publicRoute,
        privateRoute,
    };
}