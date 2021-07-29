const express = require("express");
const app = express();
const fs = require("fs");

const imageController = require("./controllers/imageController.js");

var boydParser = require("body-parser");

const settings = JSON.parse(fs.readFileSync(__dirname + "/settings.json"));

const port = settings.serverPort;

//Uporaba drugih vticnikov
app.use(boydParser.raw({
    type : "image/jpeg",
    limit : "10mb",
    extended : true
}));
app.use(boydParser.text({ extended : true }));

imageController.init(__dirname);

app.get("/getSlika/original/:slikaID", imageController.getOriginalImageByID);
app.get("/getSlika/compresed/:slikaID", imageController.getCompresedImageByID);
app.post("/setSlika/:slikaID", imageController.setImage);
app.get("/deleteSlika/original/:slikaID", imageController.deleteOriginalImage);
app.get("/deleteSlika/compresed/:slikaID", imageController.deleteCompresedImage);

//Dodatni potrebni endpointi
app.get("/", (req, res, next) => {
    res.sendFile(__dirname + "/view/index.html");
});

app.get("/checkServer", (req, res, next) => {
    res.status(200).send("OK");
});

//Zagon serverja
app.listen(port, () => {
    console.log("Server se je zagnal na portu: " + port);
});