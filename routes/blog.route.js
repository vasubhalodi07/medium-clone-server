const express = require("express");
const router = express.Router();

const controller = require("../controller/blog.controller");
const middleware = require("../middleware/check-token");

router.get("/get", controller.fetchBlog);
router.get("/get/:id", controller.fetchBlogById);
router.get("/get/user/:userid", controller.fetchBlogByUserID);

router.post("/add", middleware.checkTokenMiddleware, controller.addBlog);

router.put("/update/:id", controller.updateBlog);

router.patch("/delete/:id", controller.deleteBlog);

module.exports = router;
