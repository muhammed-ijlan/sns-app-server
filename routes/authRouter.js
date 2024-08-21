const router = require("express").Router();
const { body } = require("express-validator");
const { authController } = require("../controllers/_index");
const { verifyUser } = require("../middlewares/_index");

const registerAdminBodyValidator = [
    body("firstName").trim().notEmpty(),
    body("lastName").trim().notEmpty(),
    body("mobileNumber").trim().notEmpty(),
    body("role").trim().notEmpty().isIn(["USER", "ADMIN", "GUEST"]),
    body("email").trim().notEmpty(),
    body("hash").isLength({ min: 8, max: 20 }),
]
const loginAdminBodyValidator = [
    body("email").isEmail().notEmpty(),
    body("hash").isLength({ min: 8, max: 20 }).notEmpty(),
];



router.post("/register", registerAdminBodyValidator, authController.registerUser)
router.post("/login", loginAdminBodyValidator, authController.loginUser)
router.post("/logout", verifyUser, authController.logoutUser);

module.exports = router;