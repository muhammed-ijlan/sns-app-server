const { validationResult } = require("express-validator");
const mongoose = require("mongoose");
const { ResponseBody, ErrorBody, responseHandler } = require("../utils/_index");
const { unitService, courseService, spaceService } = require("../services/_index");

exports.createUnit = async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            throw new ErrorBody(400, "Invalid Inputs provided", errors.array());
        }
        let responseBody;

        const reqBody = req.body;

        const existingUnit = await unitService.findUnitWithFilters({ title: reqBody.title, courseId: reqBody.courseId }, "", { lean: true });
        const course = await courseService.findCourseModuleWithFilters({ _id: reqBody.courseId }, "", {})

        if (!course) {
            responseBody = new ResponseBody("Course not found", true, {});
            return responseHandler(res, next, responseBody, 400)
        }
        if (course?.isFinalized === true) {
            responseBody = new ResponseBody("The course is finalized", true, {});
            return responseHandler(res, next, responseBody, 400)
        }

        if (existingUnit) {
            responseBody = new ResponseBody("Unit already Existed", true, {});
            return responseHandler(res, next, responseBody, 200);
        }

        if (req.files && reqBody.unitType === "VIDEO") {
            if (req.files.videoURL) {
                reqBody.videoURL = req.files.videoURL[0].location;
            }
            if (req.files.subtitleURL) {
                reqBody.subtitleURL = req.files.subtitleURL[0].location;
            }
        }

        if (req.files && reqBody.unitType === "PDF") {
            if (req.files.pdfURL) {
                reqBody.pdfURL = req.files.pdfURL[0].location;
            }
        }

        const newUnit = await unitService.createUnit(reqBody);
        await newUnit.save();
        responseBody = new ResponseBody("Unit has been created", false, {});
        return responseHandler(res, next, responseBody, 200)

    } catch (e) {
        console.log(e);
        next([400, 401].includes(e.status) ? e : {});
    }
};

exports.getUnitsByCourse = async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            throw new ErrorBody(400, "Invalid Inputs", errors.array())
        };
        let responseBody;
        let { page, size, title, courseId } = req.query;
        page = page ? parseInt(page) : 0;
        size = size ? parseInt(size) : 10;
        title = title ? title : "";
        const options = {
            page, size, title, courseId
        };

        if (!mongoose.Types.ObjectId.isValid(courseId)) {
            responseBody = new ResponseBody("Invalid Id has been provided", true, {})
            return responseHandler(res, next, responseBody, 200);
        };
        const responsePayload = {
            units: [],
            maxRecords: 0,
        }
        const results = await unitService.getAllUnitsByCourse(options);
        if (results.length) {
            responsePayload.units = results[0].data;
            responsePayload.maxRecords = results[0].maxRecords;
        }
        responseBody = new ResponseBody("Unit data has been retrieved", false, responsePayload);
        return responseHandler(res, next, responseBody, 200)
    } catch (e) {
        console.log(e);
        next([400, 401].includes(e.status) ? e : {});
    }
};

exports.deleteUnit = async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty) {
            throw new ErrorBody(400, "Invalid Inputs", errors.array());
        }

        let responseBody;
        const { id } = req.body;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            responseBody = new ResponseBody("Invalid Id has been provided", true, {})
            return responseHandler(res, next, responseBody, 200)
        };

        await unitService.deleteUnitById(id);
        responseBody = new ResponseBody("Unit has been deleted", false, {});
        return responseHandler(res, next, responseBody, 200);

    } catch (e) {
        console.log(e);
        next([400, 401].includes(e.status) ? e : {});
    }
};

exports.getAUnit = async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            throw new ErrorBody(400, "Invalid Inputs", errors.array())
        }
        let responseBody;

        const { unitId, courseId } = req.query;
        if (!mongoose.Types.ObjectId.isValid(courseId) && !mongoose.isValidObjectId(unitId)) {
            responseBody = new ResponseBody("Invalid Id has been provided", true, {})
            return responseHandler(res, next, responseBody, 200)
        };

        const unit = await unitService.findUnitWithFilters({ _id: unitId, courseId: courseId }, "_id courseId unitType title duration videoURL pdfURL subtitleURL readingContent isOptional", { lean: true });

        if (!unit) {
            responseBody = new ResponseBody("Unit not found", true, {});
            return responseHandler(res, next, responseBody, 200)
        }

        responseBody = new ResponseBody("Unit has been fetched", false, unit);
        return responseHandler(res, next, responseBody, 200);

    } catch (e) {
        console.log(e);
        next([400, 401].includes(e.status) ? e : {});
    }
};

exports.updateUnit = async (req, res, next) => {
    try {
        let responseBody;
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            throw new ErrorBody(400, "Invalid inputs have been provided", errors.array())
        };
        const { id, courseId, title, duration, readingContent, isOptional } = req.body;
        if (!mongoose.Types.ObjectId.isValid(id && courseId)) {
            responseBody = new ResponseBody("Invalid Id has been provided", true, {})
            return responseHandler(res, next, responseBody, 200)
        };
        const unit = await unitService.findUnitWithFilters({ _id: id, courseId: courseId }, "", {});
        if (!unit) {
            responseBody = new ResponseBody("Unit not found", true, {});
            return responseHandler(res, next, responseBody, 200);
        }
        if (title) {
            unit.title = title;
        }
        if (duration) {
            unit.duration = duration;
        }

        if ([true, false].includes(isOptional)) {
            unit.isOptional = isOptional;
        }

        if (unit.unitType === "VIDEO") {
            if (req.files) {
                if (req.files.videoURL) {
                    const url = unit.videoURL;
                    unit.videoURL = req.files.videoURL[0].location;
                    if (url) {
                        const startIndex = url.indexOf("public/");
                        const extractedPath = url.substring(startIndex);
                        await spaceService.deleteFileFromSpace(extractedPath);
                    }
                }
                if (req.files.subtitleURL) {
                    unit.subtitleURL = req.files.subtitleURL[0].location;
                    const url = unit.subtitleURL;
                    if (url) {
                        const startIndex = url.indexOf("public/");
                        const extractedPath = url.substring(startIndex);
                        await spaceService.deleteFileFromSpace(extractedPath);
                    }
                }
            }
        } else if (unit.unitType === "PDF") {
            if (req.files) {
                const url = unit.pdfURL;
                if (req.files.pdfURL) {
                    unit.pdfURL = req.files.pdfURL[0].location;
                    if (url) {
                        const startIndex = url.indexOf("public/");
                        const extractedPath = url.substring(startIndex);
                        await spaceService.deleteFileFromSpace(extractedPath);
                    }
                }
            }
        } else {
            unit.readingContent = readingContent;
        }
        await unit.save();
        responseBody = new ResponseBody("Unit has been updated", false, {});
        return responseHandler(res, next, responseBody, 200)
    } catch (e) {
        console.log(e);
        next([400, 401].includes(e.status) ? e : {});
    }
}