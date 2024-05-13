const express = require("express");
const router = express.Router();

const controller = require("../controller/tag.controller");

router.get("/get", controller.fetchTag);

router.post("/add", controller.addTag);

router.put("/update/:id", controller.updateTag);

router.patch("/delete/:id", controller.deleteTag);

module.exports = router;
