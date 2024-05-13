const express = require("express");
const router = express.Router();

const controller = require("../controller/user.controller");
const middleware = require("../middleware/check-token");

router.post("/login", controller.login);

router.post("/register", controller.register);

router.post(
  "/check-token",
  middleware.checkTokenMiddleware,
  controller.checkToken
);

router.get(
  "/login-check-token",
  middleware.checkTokenMiddleware,
  controller.loginCheckToken
);

router.get("/", controller.fetchUsers);

router.get("/get/:id", controller.fetchUserById);

router.put(
  "/update/:id",
  middleware.checkTokenMiddleware,
  controller.updateUserDetails
);

module.exports = router;
