const { jwtService, userService } = require("../services/_index");
const { ErrorBody } = require("../utils/_index");

exports.verifyUser = async (req, res, next) => {
    try {
        let token = await jwtService.getAuthTokenFromHeaders(req);
        if (!token) {
            throw new ErrorBody();
        }
        let decoded = await jwtService.verifyUserToken(token);
        if (!decoded || !decoded._id) {
            throw new ErrorBody();
        }
        const user = await userService.findUserWithFilters({ _id: decoded._id, token: token, isBlocked: false }, "_id", { lean: true });
        if (!user) {
            throw new ErrorBody();
        }
        req.authAccount = {
            _id: user._id,
        }
        next();
    } catch (error) {
        next(new ErrorBody(401, "Unauthorized", []));
    }
}
