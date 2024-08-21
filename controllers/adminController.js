const { validationResult } = require("express-validator");
const { ErrorBody, ResponseBody, responseHandler } = require("../utils/_index");
const { adminService, userService, authService, spaceService } = require("../services/_index");
const mongoose = require("mongoose");
const path = require("path")
const fs = require("fs")

exports.createSubAdmin = async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            throw new ErrorBody(400, "Bad inputs", errors.array())
        }
        const reqBody = req.body;
        if (await adminService.findAdminWithFilters({ email: reqBody.email }, "_id", { lean: true })) {
            const responseBody = new ResponseBody("Email already existed", true, {});
            return responseHandler(res, next, responseBody, 200)
        }
        reqBody["accType"] = "SUB_ADMIN";
        const admin = await authService.registerAdmin(reqBody);
        await admin.setHash(reqBody.hash);
        await admin.save();
        const responseBody = new ResponseBody("Sub admin has been created", false, {});
        return responseHandler(res, next, responseBody, 200)
    } catch (error) {
        console.log(error);
        next([400, 401, 403].includes(error.status) ? error : {});
    }
};

exports.getSubAdmins = async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            throw new ErrorBody(400, "Bad inputs provided", errors.array());
        }
        let { page, size, isBlocked, fullname, email } = req.query;
        page = page ? parseInt(page) : 0;
        size = size ? parseInt(size) : 10;
        if (isBlocked == "true") {
            isBlocked = true;
        } else if (isBlocked == "false") {
            isBlocked = false
        }
        let options = { page, size, isBlocked, fullname, email }
        const result = await adminService.getSubAdmins(options);

        let responsePayload = {
            maxRecords: 0,
            records: []
        }
        if (result.length) {
            responsePayload.maxRecords = result[0].maxRecords || 0;
            responsePayload.records = result[0].data || [];
        }
        const responseBody = new ResponseBody("Successfully retrieved", false, responsePayload);
        return responseHandler(res, next, responseBody, 200)
    } catch (e) {
        console.log(e);
        next([400, 401].includes(e.status) ? e : {});
    }
};

exports.getAdmin = async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            throw new ErrorBody(400, "Invalid inputs", errors.array());
        };
        const { id } = req.query;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            const responseBody = new ResponseBody("Invalid Id has been provided", true, {})
            return responseHandler(res, next, responseBody, 200)
        }
        const filters = {
            _id: mongoose.Types.ObjectId(id)
        }
        const admin = await adminService.findAdminWithFilters(filters, "-hash -token", { lean: true })
        if (!admin) {
            const responseBody = new ResponseBody("No admin found", true, 200)
            return responseHandler(res, next, responseBody, 200)
        }
        const responseBody = new ResponseBody("Successfully retrieved Admin ", false, { ...admin });
        return responseHandler(res, next, responseBody, 200)
    } catch (e) {
        console.log(e);
        next([400, 401].includes(e.status) ? e : {});
    }
};

exports.updateAdmin = async (req, res, next) => {
    try {
        let responseBody;
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            throw new ErrorBody(400, "Invalid inputs", errors.array());
        };
        let { id, fullname, email, isBlocked, hash } = req.body;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            const responseBody = new ResponseBody("Invalid Id has been provided", true, {})
            return responseHandler(res, next, responseBody, 200)
        }
        const admin = await adminService.findAdminWithFilters({ _id: id }, "", {});
        if (!admin) {
            responseBody = new ResponseBody("Admin Not found", true, {});
            return responseHandler(res, next, responseBody, 200)
        }
        if (fullname) {
            admin.fullname = fullname;
        };
        if (isBlocked) {
            admin.isBlocked = isBlocked;
            if (isBlocked === "true") {
                admin.token = `${Math.random()}${Date.now()}Token`
            }
        }
        if (email) {
            if (admin.email != email) {
                if (await adminService.findAdminWithFilters({ email: email }, "_id", {})) {
                    const responseBody = new ResponseBody("Email already Exists", true, {});
                    return responseHandler(res, next, responseBody, 200);
                }
                admin.email = email;
            }
        }
        if (hash) {
            await admin.setHash(hash)
        };
        if (req.file) {
            admin.profilePic = req.file.location;
            if (admin.profilePic) {
                const url = admin.profilePic;
                const startIndex = url.indexOf("public/");
                const extractedPath = url.substring(startIndex);
                await spaceService.deleteFileFromSpace(extractedPath);
            }
        };



        await admin.save();
        responseBody = new ResponseBody("Admin Successfully updated", false, {});
        responseHandler(res, next, responseBody, 200);
    } catch (e) {
        console.log(e)
        next([400, 401].includes(e.status) ? e : {});
    }
};

