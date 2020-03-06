const path = require("path");
const express = require("express");
const multer = require("multer");
const nanoid = require("nanoid");
const config = require("../config");
const Artist = require("../models/Artist");

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, config.uploadPath);
    },
    filename: (req, file, cb) => {
        cb(null, nanoid() + path.extname(file.originalname));
    }
});

const upload = multer({storage});

const router = express.Router();

router.get("/", async (req, res) => {
    const items = await Artist.find();
    res.send(items);
});

router.post("/", upload.single("photo"), async (req, res) => {
    const artistData = req.body;

    if (req.file) {
        artistData.photo = req.file.filename;
    } else {
        artistData.photo = null;
    }

    const artist = new Artist(artistData);
    try {
        await artist.save();
        res.send(artist);
    } catch (error) {
        return res.status(400).send(error);
    }
});

module.exports = router;