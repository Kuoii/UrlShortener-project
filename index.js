require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const app = express();
const sqlite = require("better-sqlite3");
const db = new sqlite("url.db");

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));

app.use("/public", express.static(`${process.cwd()}/public`));

app.get("/", function (req, res) {
    res.sendFile(process.cwd() + "/views/index.html");
});

// Your first API endpoint
app.get("/api/hello", function (req, res) {
    res.json({ greeting: "hello API" });
});

app.get("/api/shorturl/:url", (req, res) => {
    const shortUrl = req.params;
    const statement = db.prepare("SELECT url FROM urls WHERE id = @url");
    const query = statement.all(shortUrl);
    res.redirect(query[0].url);
});

app.post("/api/shorturl", (req, res) => {
    let originalUrl = req.body;
    if (isValid(originalUrl)) {
        const query = db.prepare(
            "INSERT INTO urls (url) VALUES (@url) RETURNING id, url"
        );
        const postedQuery = query.get(originalUrl);
        //console.log(postedQuery);
        res.json({ original_url: postedQuery.url, short_url: postedQuery.id });
    } else {
        res.json({ error: "invalid url" });
    }
});

function isValid(string) {
    try {
        new URL(string);
        return true;
    } catch (err) {
        return false;
    }
}

app.listen(port, function () {
    console.log(`Listening on port ${port}`);
});
