const express = require('express');
const router = express.Router();
const path = require('path');
const { Account, Profile, readFile } = require('../data/mongodb');


const socials = {
    devan: [{ name: 'Tiktok', link: 'https://tiktok.com/@devanthedank', image: '../../src/social-media/tiktok_final.png'},
        { name: 'Twitter', link: 'https://twitter.com/devanqueue', image: '../../src/social-media/twitter_final.png' },
        { name: 'Twitch', link: 'https://twitch.tv/devanqueue', image: '../../src/social-media/twitch_final.png' },
    {name: 'Discord', link: 'https://discord.gg/qp8tBhM6Sg', image: '../../src/social-media/discord_final.png'}]
};
    
const userData = {
    devan: { displayName: 'Devan', location: 'Hoboken NJ', bio: 'Creator of cherrylink.io', pfp: '../../src/pfp.png' }
}

const reservedKeywords = ['p', 'api', 'dashboard', 'cookies'];

const notFound = (res) => res.sendFile(path.resolve(__dirname, '..', 'public', 'pages', '_hidden', 'notfound.html'));

router.get('/:username', (req, res, next) =>
{
    const username = req.params.username;
    if (!reservedKeywords.includes(username.split('/')[0]))
    {
        res.sendFile(path.resolve(__dirname, '..', 'public', 'pages', '_hidden', 'profile.html'));
    }
})

router.get('/api/:username', (req, res) =>
{
    const username = req.params.username;

    Account.findOne({ username }).select('username').lean().exec().then(acc =>
    {
        if (acc) Profile.findOne({ _id: acc._id }).exec().then(doc =>
        {
            if (doc) res.send(doc);
            else res.sendStatus(404);
        }).catch(err => res.status(500).send(err));
        else res.sendStatus(404);
    }).catch(err => res.status(500).send(err));
    
})

//@route get /api/files/:filename
//@desc fetches file based on file name
router.get('/api/files/:fileid', readFile)

module.exports = { router, reservedKeywords };