const { validationResult } = require("express-validator")
const { ErrorBody, ResponseBody, responseHandler, } = require("../utils/_index");
const { authService, jwtService, userService, } = require("../services/_index");

exports.registerUser = async (req, res, next) => {
    try {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            throw new ErrorBody(400, "Bad Inputs have been provided", errors.array());
        }
        let reqBody = req.body;
        const user = await authService.registerUser(reqBody);
        await user.setHash(reqBody.hash);
        await user.save();

        let response = new ResponseBody("User has been registered", false, {});
        return responseHandler(res, next, response, 201);
    } catch (error) {
        console.log(error);
        next([400, 401, 403].includes(error.status) ? error : {});
    }
}

exports.loginUser = async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            throw new ErrorBody(400, "Bad inputs provided", errors.array());
        }
        const reqBody = req.body;
        const filters = { email: reqBody.email };
        const user = await userService.findUserWithFilters(filters, "", {})
        if (!user) {
            let response = new ResponseBody("Invalid Account", true, {});
            res.status(200);
            res.setHeader("Content-Type", "application/json");
            return res.json(response);
        }
        if (!(await user.verifyHash(reqBody.hash))) {
            let response = new ResponseBody("Invalid password", true, {});
            res.status(200);
            res.setHeader("Content-Type", "application/json");
            return res.json(response);
        }
        let token = await jwtService.signUserAuthToken(user._id);
        user.token = token;
        await user.save();
        const responsePayload = await authService.loginUser(user);
        const responseBody = new ResponseBody("Login successfull", false, responsePayload);
        return responseHandler(res, next, responseBody, 200)

    } catch (error) {
        console.log(error);
        next([400, 401, 403].includes(error.status) ? error : {});
    }
};

exports.logoutUser = async (req, res, next) => {
    try {
        const user = req.authAccount;
        await authService.logoutUser(user._id)
        let response = new ResponseBody("Logout successful", false, {});
        responseHandler(res, next, response, 200);
    } catch (error) {
        console.log(error);
        next([400, 401, 403].includes(error.status) ? error : {});
    }
};

