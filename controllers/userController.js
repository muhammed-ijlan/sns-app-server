const { validationResult } = require("express-validator");
const { ErrorBody, ResponseBody, responseHandler, } = require("../utils/_index");
const { userService } = require("../services/_index");

exports.getAllUsers = async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            throw new ErrorBody(400, "Invalid Inputs", errors.array());
        };
        let responseBody;
        let { id, page, size, firstName, email, } = req.query;
        page = page ? parseInt(page) : 0;
        size = size ? parseInt(size) : 10;

        let options = {
            id, page, size, firstName, email,
        }
        const result = await userService.getAllUsers(options);

        const responsePayload = {
            maxRecords: 0,
            records: []
        };

        if (result.length) {
            responsePayload.maxRecords = result[0].maxRecords || 0;
            responsePayload.records = result[0].data || [];
        }

        responseBody = new ResponseBody("Users have been retrieved", false, responsePayload);
        return responseHandler(res, next, responseBody, 200)

    } catch (e) {
        console.log(e);
        next([400, 401].includes(e.status) ? e : {});
    }
};
