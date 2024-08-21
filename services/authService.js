const { userModel } = require("../models/_index")

exports.registerUser = async (doc) => {
    return new userModel({ ...doc })
}

exports.loginUser = async (user) => {
    return {
        _id: user._id,
        token: user.token,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        mobileNumber: user.mobileNumber,
        role: user.role,
    };
};


exports.logoutUser = async (id) => {
    return userModel.findByIdAndUpdate(id, { $set: { token: `${Math.random()}${Date.now()}Token` } });
}
