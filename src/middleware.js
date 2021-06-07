const jwt = require("jsonwebtoken");
const {jwtSecret} = require("./config");

module.exports = {
    loggedIn: (req, res, next) => {
        try {
            const token = typeof req.headers.authorization != 'undefined' ? req.headers.authorization.split(" ")[1] : 'undefined';
            // const token = req.headers.authorization?.split(" ")[1];
            const decodedToken = jwt.verify(token, jwtSecret);
            req.userData = decodedToken;
            next();
        }
        catch(e) {
            console.log(e);
            return res.send({err: "Validation failed"});
        }
    }
}