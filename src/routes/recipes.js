const jwt = require("jsonwebtoken");
const express = require("express");
const mysql = require("mysql2/promise");
const router = express.Router();

const {mysqlConfig, jwtSecret} = require("../config");

router.get("/:id", async (req, res) => {
    let userId = false;
    const token = req.headers.authorization?.split(" ")[1];
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
        if (userId) {
            queryStr = `SELECT recipes.id, recipes.image, recipes.title, recipes.description, recipes.owner_id, user_favs.recipe_id, COUNT(comments.id) AS comments_num FROM recipes LEFT JOIN (SELECT recipe_id FROM favourites WHERE user_id = ${mysql.escape(userId)}) AS user_favs ON recipes.id = user_favs.recipe_id LEFT JOIN comments ON recipes.id = comments.recipe_id WHERE recipes.id = ${mysql.escape(req.params.id)} GROUP BY recipes.id  LIMIT 1`;
        }
        else {
            queryStr = `SELECT recipes.id, recipes.image, recipes.title, recipes.description, recipes.owner_id, COUNT(comments.id) AS comments_num FROM recipes LEFT JOIN comments ON recipes.id = comments.recipe_id WHERE recipes.id = ${mysql.escape(req.params.id)} GROUP BY recipes.id LIMIT 1`;
        }
        const [recipe] = await con.execute(queryStr);
        const [comments] = await con.execute(`SELECT * FROM comments WHERE recipe_id = ${mysql.escape(req.params.id)}`);
        con.end();
        res.send({ data: {recipe, comments} });
    }
    catch(e){
        console.log(e);
        return res.send({error: "Unexpected error"});
    }
});




module.exports = router;