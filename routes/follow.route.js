const express = require("express");
const router = express.Router();

const controller = require("../controller/follow.controller");
const middleware = require("../middleware/check-token");

router.post(
  "/follow/:following_id",
  middleware.checkTokenMiddleware,
  controller.followUser
);

router.delete(
  "/unfollow/:following_id",
  middleware.checkTokenMiddleware,
  controller.unfollowUser
);

router.get("/following/:userId", controller.fetchFollowing);

router.get("/followers/:userId", controller.fetchFollowers);

module.exports = router;
