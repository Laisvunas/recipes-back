const jwt = require("jsonwebtoken");
const express = require("express");
const mysql = require("mysql2/promise");
const router = express.Router();

const {mysqlConfig, jwtSecret} = require("../config");

router.post("/", async (req, res) => {
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
        let queryStr = ``;
        const searchPhr = `%${req.body.searchPhr}%`;
        if (userId) {
            queryStr = `SELECT recipes.id, recipes.image, recipes.title, recipes.description, recipes.owner_id, user_favs.recipe_id, COUNT(comments.id) AS comments_num FROM recipes LEFT JOIN (SELECT recipe_id FROM favourites WHERE user_id = ${mysql.escape(userId)}) AS user_favs ON recipes.id = user_favs.recipe_id LEFT JOIN comments ON recipes.id = comments.recipe_id WHERE recipes.title LIKE ${mysql.escape(searchPhr)} GROUP BY recipes.id ORDER BY recipes.timestamp DESC LIMIT 30`;
            console.log(queryStr);
        }
        else {
            queryStr = `SELECT recipes.id, recipes.image, recipes.title, recipes.description, recipes.owner_id, COUNT(comments.id) AS comments_num FROM recipes LEFT JOIN comments ON recipes.id = comments.recipe_id WHERE recipes.title LIKE ${mysql.escape(searchPhr)} GROUP BY recipes.id ORDER BY recipes.timestamp DESC LIMIT 30`;
            console.log(queryStr);
        }
        const [searchRes] = await con.execute(queryStr);
        con.end();
        res.send({ data: searchRes });
    }
    catch(e){
        console.log(e);
        return res.send({error: "Unexpected error"});
    }
});

module.exports = router;