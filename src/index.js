const express = require("express");
const cors = require("cors");
require("dotenv").config();

const authRoutes = require("./routes/auth");
const contentRoutes = require("./routes/content");
const commentsRoutes = require("./routes/comments");
const recipesRoutes = require("./routes/recipes");
const recipesAllRoutes = require("./routes/all");
const newRecipeRoutes = require("./routes/new");
const favsRoutes = require("./routes/favs");
const starsRoutes = require("./routes/stars");
const searchRoutes = require("./routes/search");

const app = express();

app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
    res.send({msg: "Server is running successfully"}); 
});

app.use("/auth", authRoutes);
app.use("/content", contentRoutes);
app.use("/comments", commentsRoutes);
app.use("/recipes", recipesRoutes);
app.use("/all", recipesAllRoutes);
app.use("/new", newRecipeRoutes);
app.use("/favs", favsRoutes);
app.use("/stars", starsRoutes);
app.use("/search", searchRoutes);

app.all("*", (req, res) => {
    res.status(404).send({ error: "Page not found" });
});

const port = process.env.PORT || 8080;

app.listen(port, () => console.log(`Listening on port ${port}`));