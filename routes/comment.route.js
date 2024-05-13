const express = require("express");
const router = express.Router();

const controller = require("../controller/comment.controller");
const middleware = require("../middleware/check-token");

router.use(middleware.checkTokenMiddleware);

router.get("/get/:id", controller.getCommentByBlogId);

router.post("/add", controller.createComment);

router.put("/update/:id", controller.updateComment);

router.patch("/delete/:id", controller.deleteComment);

module.exports = router;
