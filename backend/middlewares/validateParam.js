import { StatusCodes } from "http-status-codes";

export function validateParam(paramName) {
    return (req, res, next) => {
        const param = req.params[paramName]
        if (!param) {
            next({
                statusCode: StatusCodes.BAD_REQUEST,
                message: `No ${paramName} provided.`,
                data: { field: paramName }
            })
        }

        req[paramName] = param
        next();
    };
}