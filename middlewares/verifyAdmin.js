const { jwtService, authService, adminService } = require("../services/_index");
const { ErrorBody } = require("../utils/_index");

exports.verifyAdmin = async (req, res, next) => {
    try {
        let token = await jwtService.getAuthTokenFromHeaders(req);
        if (!token) {
            throw new ErrorBody();
        }
        let decoded = await jwtService.verifyAdminToken(token);
        if (!decoded || !decoded._id) {
            throw new ErrorBody();
        }
        const admin = await adminService.findAdminWithFilters({ _id: decoded._id, token: token, isBlocked: false }, "_id accType", { lean: true });
        if (!admin) {
            throw new ErrorBody();
        }
        req.authAccount = {
            _id: admin._id,
            accType: admin.accType,
        }
        next();
    } catch (error) {
        next(new ErrorBody(401, "Unauthorized", []));
    }
}
