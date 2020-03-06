const express = require("express");
const Track = require("../models/Track");
const Album = require("../models/Album");
const Artist = require("../models/Artist");


const router = express.Router();

router.get("/", async (req, res) => {
    if (!req.query.album) {
        const items = await Track.find();
        res.send(items);
    }
    const artist = await Track.find({album: req.query.album});
    res.send(artist);
});

router.get("/:id", async (req, res) => {
    try {
        const item = await Artist.findById(req.params.id);
        const items = await Album.find({artist: item});
        const tracks = await Track.find({album: items});
        if (!item) {
            return res.status(404).send({message: "Not found"});
        }
        res.send(tracks);
    } catch (error) {
        res.status(404).send({message: "Not found"});
    }
});

router.post('/', async (req, res) => {
    const trackData = req.body;
    const track = new Track(trackData);
    await track.save();
    res.send(track);
});

module.exports = router;