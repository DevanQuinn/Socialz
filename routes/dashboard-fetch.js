const express = require('express');
const router = express.Router();
const path = require('path');
const { Account, Profile, SubSocial, storage, gfs } = require('../data/mongodb');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const multer = require('multer');
const GridFsStorage = require('multer-gridfs-storage');
const Grid = require('gridfs-stream');


const upload = multer({ storage });
const notFound = (res) => res.sendFile(path.resolve(__dirname, '..', 'public', 'pages', '_hidden', 'notfound.html'));

router.use(express.json());

//@route get /
//@desc fetch profile data (social links) for dashboard view
router.get('/', (req, res) =>
{
    const id = req.locals.user.id;
    Profile.findById(id).lean().exec().then((doc) =>
    {
        if (doc) res.send({ profile: doc })
        else res.sendStatus(404);
    }).catch((err) => res.sendStatus(404));
})

//@route get /username
//@desc fetch username for navigation to personal page from dashboard
router.get('/username/', (req, res) =>
{
    const username = req.locals.user.username;
    if (username) res.status(200).send({username});
    else res.sendStatus(404);
    
})

//@route put /
//@desc upload profile info such as name and bio (uses multer for avatar)
router.put('/', upload.single('avatar'), (req, res) =>
{
    multer({ storage });
    const id = req.locals.user.id;
    const { displayName, location, bio } = req.body;
    const update = { displayName, location, bio };
    //Set image if new one was uploaded; if not, keep old image
    if (req.file) update.avatar = req.file.id;
    Profile.findByIdAndUpdate(id, update).exec().then(doc =>
    {
        if (doc) res.sendStatus(204);
        else res.sendStatus(500);
    }).catch(err => res.sendStatus(500))
})

//@route get /image
//@desc gets images from folder *DOESNT WORK*
router.get('/image/', (req, res) =>
{
    const files = fs.readdirSync('./public/src/social-media');
    const filesArr = files.filter(e => e.split('.')[1] == 'png');
    const imagePath = path.resolve('public', 'src', 'social-media');
    // res.status(200).send({ images: filesArr, path: imagePath });
    res.status(200).send(path.join('public', 'src', 'social-media', 'instagram_final.png'))
})

//@route put /update
//@desc updates mongodb database with social links, will combine with general info later
router.put('/update/', (req, res) =>
{
    const { id, socials } = req.body;
    const updatedSocials = [];
    socials.forEach(e =>
    {
        const { name, link, orderIndex } = e;
        const updatedSub = new SubSocial({ name, link, img: null });
        updatedSocials.push(updatedSub);
    })
    Profile.findByIdAndUpdate(id, { socials: updatedSocials })
        .exec()
        .then(doc =>
        {
            if (doc) res.sendStatus(204);
            else res.sendStatus(500);
        })
        .catch(err => res.status(500).send(err));
})

module.exports = router;