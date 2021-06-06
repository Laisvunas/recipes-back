const express = require("express");
const mysql = require("mysql2/promise");
const router = express.Router();
const middleware = require("../middleware");

const {mysqlConfig, jwtSecret} = require("../config");

router.post("/", middleware.loggedIn, async (req, res) => {
    if (!req.body.title || !req.body.image || !req.body.description) {
        return res.status(400).send({error: "Incorrect data passed"});
    }

    try {
        const con = await mysql.createConnection(mysqlConfig);
        const [data] = await con.execute(`INSERT INTO recipes (owner_id, title, image, description) VALUES ('${req.userData.id}', ${mysql.escape(req.body.title)}, ${mysql.escape(req.body.image)}, ${mysql.escape(req.body.description)})`);
        con.end();

        if (data.affectedRows !== 1) {
            return res.status(500).send({error: "Unexpected error"});
        }

        res.send({msg: "Successfully added a recipe"});
    }
    catch(e){
        console.log(e);
        return res.send({error: "Unexpected error"});
    }
});


module.exports = router;