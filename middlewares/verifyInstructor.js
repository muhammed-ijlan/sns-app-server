const { jwtService, authService, adminService, instructorService } = require("../services/_index");
const { ErrorBody } = require("../utils/_index");

exports.verifyInstructor = async (req, res, next) => {
    try {
        let token = await jwtService.getAuthTokenFromHeaders(req);
        if (!token) {
            throw new ErrorBody();
        }
        let decoded = await jwtService.verifyInstructorToken(token);
        if (!decoded || !decoded._id) {
            throw new ErrorBody();
        }
        const instructor = await instructorService.findInstructorWithFilters({ _id: decoded._id, token: token, isBlocked: false }, "_id accType", { lean: true });
        if (!instructor) {
            throw new ErrorBody();
        }
        req.authAccount = {
            _id: instructor._id
        }
        next();
    } catch (error) {
        next(new ErrorBody(401, "Unauthorized", []));
    }
}
