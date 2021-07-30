const express = require('express');
const passport = require('passport');
const middleware = require('../controller');
const controller = require('./controller');
const router = express.Router();

router.post("/add", [middleware.verifyToken], controller.create);
router.get("/all", [middleware.verifyToken], controller.getAll);
router.get("/acctnumber", [middleware.verifyToken], controller.getbyaccountNumber);
router.get("/identity", [middleware.verifyToken], controller.getbyidentityNumber);
router.patch("/update/:id", [middleware.verifyToken], controller.update);
router.delete("/delete/:id", [middleware.verifyToken], controller.delete);



module.exports = router;
