const express = require("express");
const router = express.Router();

const controller = require("../controller/like.controller");
const middleware = require("../middleware/check-token");

router.post(
  "/add/:blog_id",
  middleware.checkTokenMiddleware,
  controller.addLike
);

router.delete(
  "/remove/:blog_id",
  middleware.checkTokenMiddleware,
  controller.removeLike
);

module.exports = router;
