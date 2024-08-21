const jwt = require("jsonwebtoken");
const { ErrorBody } = require("../utils/_index");

exports.getAuthTokenFromHeaders = (req) => {
    try {
        const { headers: { authorization } } = req;
        if (authorization && authorization.split(" ")[0] === "Bearer") {
            const token = authorization.split(" ")[1];
            return token;
        } else {
            throw new ErrorBody(401, "Unauthorized", [])
        }
    } catch (e) {
        return Promise.reject(error);
    }
}

exports.checkIfAuthTokenExists = (req) => {
    try {
        const { headers: { authorization } } = req;
        if (authorization && authorization.split(" ")[0] === "Bearer") {
            const token = authorization.split(" ")[1];
            return token;
        } else {
            return false;
        }
    } catch (e) {
        return false;
    }
}

exports.signUserAuthToken = async (id) => {
    return new Promise((resolve, reject) => {
        try {
            const token = jwt.sign({ _id: id }, process.env.USER_TOKEN_JWT_SECRET)
            return resolve(token)

        } catch (error) {
            return reject(error)
        }
    })
}

exports.verifyUserToken = (token) => {
    return new Promise((resolve, reject) => {
        try {
            const decoded = jwt.verify(token, process.env.USER_TOKEN_JWT_SECRET, { ignoreExpiration: false })
            return resolve(decoded);
        } catch (e) {
            return reject(e)
        }
    })
};
