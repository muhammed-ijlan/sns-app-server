const { jwtService, authService, adminService, userService } = require("../services/_index");
const { ErrorBody } = require("../utils/_index");

exports.getUserId = async (req, res, next) => {
  try {
    let token = await jwtService.checkIfAuthTokenExists(req);
    if (token && token !== "null") {
      let decoded = await jwtService.verifyUserToken(token);
      if (decoded && decoded._id) {
        const user = await userService.findUserWithFilters(
          { _id: decoded._id, token: token, isBlocked: false },
          "_id",
          { lean: true }
        );
        if (user) {
          req.authAccount = {
            _id: user._id,
          };
        }
      }
    } else {
      req.authAccount = {
        _id: null,
      };
    }
    next();
  } catch (error) {
    next(new ErrorBody(401, "Unauthorized", []));
  }
};
