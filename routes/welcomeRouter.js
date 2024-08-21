const router = require("express").Router();
const { ErrorBody, ResponseBody, responseHandler } = require("../utils/_index");

router.get("/", async (req, res, next) => {
  try {
    let responseBody = new ResponseBody("Welcome", false, { status: "Success" });
    responseHandler(res, next, responseBody);
  } catch (error) {
    console.log(error);
    next([400, 401, 403].includes(error.status) ? error : {});
  }
});

module.exports = router;
