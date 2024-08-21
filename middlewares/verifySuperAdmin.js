const { jwtService, adminService } = require("../services/_index");
const { ErrorBody, ResponseBody, responseHandler } = require("../utils/_index");


exports.verifySuperAdmin = async (req, res, next) => {
    try {
        const token = await jwtService.getAuthTokenFromHeaders(req);
        if (!token) {
            throw new ErrorBody();
        }
        let decoded = await jwtService.verifyAdminToken(token);
        if (!decoded && !decoded._id) {
            throw new ErrorBody();
        }
        const admin = await adminService.findAdminWithFilters({ _id: decoded._id, token: token, isBlocked: false, accType: "SUPER_ADMIN" }, "_id accType", { lean: true })
        if (!admin) {
            throw new ErrorBody();
        }
        req.authAccount = {
            _id: admin._id,
            accType: admin.accType,
        }
        next();
    } catch (e) {
        next(new ErrorBody(401, "Unauthorized", []));
    }
}