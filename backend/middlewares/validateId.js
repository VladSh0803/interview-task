import { StatusCodes } from "http-status-codes";

export function validateId(idParamName = 'id') {
    return (req, res, next) => {
        const numberId = req[idParamName]
        if (!Number.isInteger(numberId) || numberId <= 0) {
            next({
                statusCode: StatusCodes.BAD_REQUEST,
                message: `Invalid ${idParamName} provided.`,
                data: { field: idParamName, value: req[idParamName] },
            });
        }

        req[idParamName] = numberId;
    };
}