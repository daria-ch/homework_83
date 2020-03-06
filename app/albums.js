const path = require("path");
const express = require("express");
const multer = require("multer");
const nanoid = require("nanoid");
const config = require("../config");
const Album = require("../models/Album");

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
    if (!req.query.artist) {
        const items = await Album.find();
        res.send(items);
    }
    const artist = await Album.find({artist: req.query.artist});
    res.send(artist);
});

router.get("/:id", async (req, res) => {
    try {
        const item = await Album.findById(req.params.id).populate('artist');

        if (!item) {
            return res.status(404).send({message: "Not found"});
        }
        res.send(item);
    } catch (error) {
        res.status(404).send({message: "Not found"});
    }
});

router.post("/", upload.single("image"), async (req, res) => {
    const albumData = req.body;

    if (req.file) {
        albumData.image = req.file.filename;
    } else {
        albumData.image = null;
    }

    const album = new Album(albumData);
    try {
        await album.save();
        res.send(album);
    } catch (error) {
        return res.status(400).send(error);
    }
});

module.exports = router;