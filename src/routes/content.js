const express = require("express");
const router = express.Router();
const middleware = require("../middleware");

const {mysqlConfig, jwtSecret} = require("../config");

router.get("/", middleware.loggedIn, async (req, res) => {
    res.send({msg: "logged-in", email: req.userData.email});
});

module.exports = router;