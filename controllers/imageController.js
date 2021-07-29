const fs = require("fs");
const sharp = require("sharp");
const { dir } = require("console");
var dirname;

function saveImage(image, slikaID) {
    try {
        sharp(image).jpeg({ 
            quality: 100 
        }).toFile(dirname + "/photos/original/" + slikaID + ".jpg", (err) => { 
            if (err) throw err;
        });
    } catch (err) {
        console.log("NAPAKA PRI SHRANJEVANJU SLIKE: " + err);
    }
}

function compresImage(image, slikaID) {
    try {
        sharp(image).resize({
            fit: sharp.fit.contain,
            width: 200
        })
        .jpeg({ 
            quality: 65 
        }).toFile(dirname + "/photos/compresed/" + slikaID + ".jpg", (err) => { 
            if (err) throw err;
        });
    } catch (err) {
        console.log("NAPAKA PRI SHRANJEVANJU SLIKE: " + err);
    }
}

module.exports = {
    init: function(_dirname) {
        dirname = _dirname;
    },
    getOriginalImageByID: function(req, res) {
        var path = dirname + "/photos/original/" + req.params.slikaID + ".jpg";
        if (fs.access(path, fs.constants.F_OK, (err) => {
            if (err) {
                res.status(404).send("Datoteka ne obstaja");
            } else {
                res.sendFile(path);
            }
        }));
    },
    getCompresedImageByID: function(req, res) {
        var path = dirname + "/photos/compresed/" + req.params.slikaID + ".jpg";
        if (fs.access(path, fs.constants.F_OK, (err) => {
            if (err) {
                res.status(404).send("Datoteka ne obstaja");
            } else {
                res.sendFile(path);
            }
        }));
    },
    setImage: function(req, res) {
        var pathOriginal = dirname + "/photos/original/" + req.params.slikaID + ".jpg";
        var pathCompresed = dirname + "/photos/compresed/" + req.params.slikaID + ".jpg";
        if (fs.access(pathOriginal, fs.constants.F_OK, (err) => {
            if (err) {
                saveImage(req.body, req.params.slikaID)
                compresImage(req.body, req.params.slikaID)
                res.status(200).send("Done");
            } else {
                fs.unlinkSync(pathOriginal);
                fs.unlinkSync(pathCompresed);
                saveImage(req.body, req.params.slikaID)
                compresImage(req.body, req.params.slikaID)
                res.status(200).send("Done");
            }
        }));
    },
    deleteOriginalImage: function(req, res) {
        var path = dirname + "/photos/original/" + req.params.slikaID + ".jpg";
        if (fs.access(path, fs.constants.F_OK, (err) => {
            if (!err) {
                fs.unlink(path, (err) => {
                    if (err) {
                        res.status(404).send("Brisanje ni bilo uspesno");
                    } else {
                        res.status(200).send("Brisanje uspesno");
                    }
                });
            }
        }));
    },
    deleteCompresedImage: function(req, res) {
        var path = dirname + "/photos/compresed/" + req.params.slikaID + ".jpg";
        if (fs.access(path, fs.constants.F_OK, (err) => {
            if (!err) {
                fs.unlink(path, (err) => {
                    if (err) {
                        res.status(404).send("Brisanje ni bilo uspesno");
                    } else {
                        res.status(200).send("Brisanje uspesno");
                    }
                });
            }
        }));
    }
}; 