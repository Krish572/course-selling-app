const {Router} = require("express");
const router = Router();
const {createCourse, courses, updateCourse, deleteCourse, purchaseCourse} = require("../controllers/course.controller");
const authMiddleware = require("../middleware/auth.mid");

router.get("/", courses);
router.post("/create", authMiddleware("admin"),  createCourse);
router.put("/update/:id", authMiddleware("admin"), updateCourse)
router.delete("/delete/:id", authMiddleware("admin"), deleteCourse)
router.post("/purchase/:id", authMiddleware("user"), purchaseCourse)

module.exports = router;