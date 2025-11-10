const {Router} = require("express");
const router = Router();
const {createCourse, courses, updateCourse} = require("../controllers/course.controller");
const authMiddleware = require("../middleware/auth.mid");

router.get("/", courses);
router.post("/create", authMiddleware("admin"),  createCourse);
router.put("/update/:id", authMiddleware("admin"),  updateCourse)

module.exports = router;