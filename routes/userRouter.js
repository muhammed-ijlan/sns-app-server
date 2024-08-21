const router = require("express").Router();
const { query } = require("express-validator");
const { userController } = require("../controllers/_index");
const { verifyUser } = require("../middlewares/_index");


// ======================= USER ROUTES ========================== //

const getAllUsersValidator = [
    query("id").trim().isMongoId(),
    query("firstName").trim(),
    query("email").trim(),
]

router.get("/all", verifyUser, getAllUsersValidator, userController.getAllUsers);


module.exports = router;