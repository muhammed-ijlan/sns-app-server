const { adminModel } = require("../models/_index");

exports.findAdminWithFilters = async (filters = {}, projections = null, options = {}) => {
    return await adminModel.findOne(filters, projections, options);
};

exports.getSubAdmins = async (options) => {
    let pipeline = [];
    if (options.fullname) {
        pipeline.push({
            $match: {
                fullname: { $regex: options.fullname, $options: "i" }
            }
        })
    };

    if (options.email) {
        pipeline.push({
            $match: {
                email: { $regex: options.email, $options: "i" }
            }
        })
    }

    if ([true, false].includes(options.isBlocked)) {
        pipeline.push({
            $match: {
                isBlocked: options.isBlocked
            }
        })
    };


    pipeline.push(
        {
            $match: {
                accType: "SUB_ADMIN"
            }
        },
        {
            $sort: {
                _id: -1
            }
        },
        {
            $facet: {
                metadata: [
                    {
                        $group: {
                            _id: null,
                            total: { $sum: 1 }
                        }
                    }
                ],
                data: [
                    { $skip: options.page * options.size },
                    {
                        $limit: options.size
                    },
                    {
                        $project: {
                            profilePic: 1,
                            fullname: 1,
                            email: 1,
                            accType: 1,
                            isBlocked: 1,
                            lastLogin: 1,
                        }
                    }
                ]
            }
        },
        {
            $project: {
                data: 1,
                maxRecords: { $ifNull: [{ $arrayElemAt: ["$metadata.total", 0] }, 0] }
            }
        }
    );
    return adminModel.aggregate(pipeline)
}