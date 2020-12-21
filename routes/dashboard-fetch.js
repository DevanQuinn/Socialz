const express = require('express');
const router = express.Router();
const path = require('path');
const { Profile } = require('../data/mongodb');
const jwt = require('jsonwebtoken');
const fs = require('fs');

const notFound = (res) => res.sendFile(path.resolve(__dirname, '..', 'public', 'pages', '_hidden', 'notfound.html'));

router.use(express.json());

router.get('/', (req, res) =>
{
    const id = req.locals.user.id;
    Profile.findOne({ _id: id }).lean().exec().then((doc) =>
    {
        if (doc) res.send({ profile: doc })
        else res.sendStatus(404);
    }).catch((err) => res.sendStatus(404));
})

router.put('/', (req, res) =>
{
    const id = req.locals.user.id;
    const { displayName, location, bio } = req.body;
    Profile.updateMany({ _id: id }, { displayName, location, bio }).exec().then(doc =>
    {
        if (doc) res.sendStatus(204);
        else res.sendStatus(501);
    }).catch(err => res.sendStatus(501))
})

router.get('/image/', (req, res) =>
{
    const files = fs.readdirSync('./public/src/social-media');
    const filesArr = files.filter(e => e.split('.')[1] == 'png');
    const imagePath = path.resolve('public', 'src', 'social-media');
    // res.status(200).send({ images: filesArr, path: imagePath });
    res.status(200).send(path.join('public', 'src', 'social-media', 'instagram_final.png'))
})

module.exports = router;