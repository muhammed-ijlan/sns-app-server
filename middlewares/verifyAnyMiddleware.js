const { ErrorBody } = require("../utils/ErrorBody");

exports.verifyAnyMiddleware = (...middlewares) => {
    return async (req, res, next) => {
        for (const middleware of middlewares) {
            try {
                await new Promise((resolve, reject) => {
                    middleware(req, res, (error) => {
                        if (error) {
                            reject(error);
                        } else {
                            resolve();
                        }
                    });
                });
                return next();
            } catch (error) {
            }
        }
        next(new ErrorBody(401, "Unauthorized", []));
    };
};