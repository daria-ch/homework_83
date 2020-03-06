const express = require('express');
const TrackHistory = require('../models/TrackHistory');
const User = require('../models/User');
const Track = require('../models/Track');

const router = express.Router();

router.post('/', async (req, res) => {
    const authorizationHeader = req.get('Authorization');
    if (!authorizationHeader) {
        return res.status(401).send({error: "No authorization header"});
    }
    const [type, token] = authorizationHeader.split(' ');

    if (type !== 'Token' || !token) {
        return res.status(401).send({error: "Authorization type is wrong or token is not present"});
    }

    const user = await User.findOne({token});

    if (!user) {
        return res.status(401).send({error: "No user found"})
    }

    const trackData = {user: user._id, track: req.body.track};
    const track = new TrackHistory(trackData);
    await track.save();

    const trackInfo = await TrackHistory.findOne({user: user._id,}).populate('user').findOne({track: req.body.track}).populate('track');

    res.send(trackInfo);
});

module.exports = router;