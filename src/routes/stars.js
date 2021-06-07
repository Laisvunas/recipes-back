const jwt = require("jsonwebtoken");
const express = require("express");
const mysql = require("mysql2/promise");
const router = express.Router();

const {mysqlConfig, jwtSecret} = require("../config");

router.get("/delete/:id", async (req, res) => {
    let userId = false;
    const token = typeof req.headers.authorization != 'undefined' ? req.headers.authorization.split(" ")[1] : 'undefined';
    //const token = req.headers.authorization?.split(" ")[1];
    try {
        const decodedToken = jwt.verify(token, jwtSecret);
        req.userData = decodedToken;
        userId = req.userData.id;
    }
    catch(e) {
        console.log(e);
    }
    try {
        const con = await mysql.createConnection(mysqlConfig);
        console.log(userId);
        if (userId) {
            const queryStr = `DELETE FROM favourites WHERE user_id = ${mysql.escape(userId)} AND recipe_id = ${mysql.escape(req.params.id)}`; 
            const [deletedStar] = await con.execute(queryStr);
            con.end();
            res.send({ data: deletedStar });
        }
    }
    catch(e){
        console.log(e);
        return res.send({error: "Unexpected error"});
    }
});

router.get("/add/:id", async (req, res) => {
    let userId = false;
    const token = typeof req.headers.authorization != 'undefined' ? req.headers.authorization.split(" ")[1] : 'undefined';
    //const token = req.headers.authorization?.split(" ")[1];
    try {
        const decodedToken = jwt.verify(token, jwtSecret);
        req.userData = decodedToken;
        userId = req.userData.id;
    }
    catch(e) {
        console.log(e);
    }
    try {
        const con = await mysql.createConnection(mysqlConfig);
        console.log(userId);
        if (userId) {
            const queryStr = `INSERT INTO favourites (user_id, recipe_id) VALUES (${mysql.escape(userId)}, ${mysql.escape(req.params.id)})`;
            const [addedStar] = await con.execute(queryStr);
            con.end();
            res.send({ data: addedStar });
        }
    }
    catch(e){
        console.log(e);
        return res.send({error: "Unexpected error"});
    }
});

module.exports = router;