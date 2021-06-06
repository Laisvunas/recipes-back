const express = require("express");
const mysql = require("mysql2/promise");
const router = express.Router();
const middleware = require("../middleware");

const {mysqlConfig, jwtSecret} = require("../config");

router.post("/", middleware.loggedIn, async (req, res) => {
    if (!req.body.comment || !req.body.recipeId) {
        return res.status(400).send({error: "Incorrect data passed"});
    }

    try {
        const con = await mysql.createConnection(mysqlConfig);
        const [data] = await con.execute(`INSERT INTO comments (user_id, recipe_id, comment) VALUES ('${req.userData.id}', ${mysql.escape(req.body.recipeId)}, ${mysql.escape(req.body.comment)})`);
        con.end();

        if (data.affectedRows !== 1) {
            return res.status(500).send({error: "Unexpected error"});
        }

        res.send({msg: "Successfully added a comment"});
    }
    catch(e){
        console.log(e);
        return res.send({error: "Unexpected error"});
    }
});


module.exports = router;