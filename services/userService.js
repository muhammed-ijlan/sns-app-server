const { default: mongoose } = require("mongoose");
const { userModel } = require("../models/_index");

exports.findUserWithFilters = async (filters = {}, projections = null, options = {}) => {
    return await userModel.findOne(filters, projections, options);
};


exports.getAllUsers = async (options) => {
    let pipeline = [];

    if (options.fistName) {
        pipeline.push(
            {
                $match: { fullname: { $regex: options.fistName, $options: "i" } }
            }
        );
    };

    if (options.id) {
        pipeline.push({
            $match: {
                _id: mongoose.Types.ObjectId(options.id)
            }
        })
    };

    if (options.email) {
        pipeline.push({
            $match: {
                email: {
                    $regex: options.email, $options: "i"
                }
            }
        })
    }

    pipeline.push(
        {
            $facet: {
                metaData: [
                    {
                        $group: {
                            _id: null,
                            total: { $sum: 1 }
                        }
                    }
                ],
                data: [
                    { $skip: options.page * options.size },
                    { $limit: options.size },
                    {
                        $project: {
                            firstName: 1,
                            lastName: 1,
                            email: 1,
                            mobileNumber: 1,
                            role: 1,
                        }
                    }
                ],
            },
        },
        {
            $project: {
                data: 1,
                maxRecords: { $ifNull: [{ $arrayElemAt: ["$metaData.total", 0] }, 0] }
            }
        },

    );
    return await userModel.aggregate(pipeline);
};

