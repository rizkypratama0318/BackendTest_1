const express = require("express");
const router = express.Router();
const controller = require("./controller");

router.get('/', (req,res) => {
    return res.send('success')
    });

router.post('/daftar', controller.DaftarUser);
router.post('/login', controller.loginUser);


module.exports = router