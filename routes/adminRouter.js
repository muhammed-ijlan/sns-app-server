const { query, body } = require("express-validator");
const { adminController } = require("../controllers/_index");
const { verifySuperAdmin, verifyAdmin } = require("../middlewares/_index");

const router = require("express").Router();

const getAdminQueryValidator = [
    query("id").notEmpty()
];

const updateAdminBodyValidator = [
    body('id').trim().notEmpty(),
    body('fullname').trim().toLowerCase().optional({ checkFalsy: true }),
    body('email').trim().toLowerCase().optional({ checkFalsy: true }).isEmail(),
    body('hash').trim().optional({ checkFalsy: true }).isLength({ min: 8, max: 20 }),
    body("isBlocked").optional({ checkFalsy: true }).isIn(["true", "false"]),
]

const registerAdminBodyValidator = [
    body("fullname").trim().notEmpty(),
    body("email").trim().notEmpty(),
    body("hash").isLength({ min: 8, max: 20 }),
]

router.post("/create/sub", verifySuperAdmin, registerAdminBodyValidator, adminController.createSubAdmin);
router.get("/sub/getall", verifySuperAdmin, adminController.getSubAdmins);
router.get("/get", verifyAdmin, getAdminQueryValidator, adminController.getAdmin);
router.put("/update", verifySuperAdmin, updateAdminBodyValidator, adminController.updateAdmin);



module.exports = router;