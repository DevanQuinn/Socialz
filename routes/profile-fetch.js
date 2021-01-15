const express = require('express');
const router = express.Router();
const path = require('path');
const { Account, Profile, readFile } = require('../data/mongodb');
const { JSDOM } = require('jsdom');


const socials = {
    devan: [{ name: 'Tiktok', link: 'https://tiktok.com/@devanthedank', image: '../../src/social-media/tiktok_final.png'},
        { name: 'Twitter', link: 'https://twitter.com/devanqueue', image: '../../src/social-media/twitter_final.png' },
        { name: 'Twitch', link: 'https://twitch.tv/devanqueue', image: '../../src/social-media/twitch_final.png' },
    {name: 'Discord', link: 'https://discord.gg/qp8tBhM6Sg', image: '../../src/social-media/discord_final.png'}]
};


const reservedKeywords = ['p', 'api', 'dashboard', 'cookies'];

const notFound = (res) => res.sendFile(path.resolve(__dirname, '..', 'public', 'pages', '_hidden', 'notfound.html'));

//@route get /:username
//@param1 username = registered username w/ profile
//@desc sends the html file with the raw profile page if the page is not a reserved keyword (to be filled in by frontend js)
router.get('/:username', async (req, res, next) =>
{
    const username = req.params.username;
    if (!reservedKeywords.includes(username.split('/')[0]))
    {
        const page = path.resolve(__dirname, '..', 'public', '_hidden', 'profile.html');
        JSDOM.fromFile('./public/pages/_hidden/profile.html')
            .then(dom =>
            {
                dom.window.document.title = `${username} | Mylinked.io`
                const document = dom.window.document;
                const html = `${'<!DOCTYPE html>'} <head> ${document.head.innerHTML} </head> <body> ${document.body.innerHTML} </body>`;
                res.send(html);
            })
        // page.title = `${username} | Mylinked.io`;
    }
})

//@route get /api/:username
//@param1 username = username to be queried
//@desc if account with username is found, fetch profile information from database
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
//@param1 filename = name of file to be displayed (stored in database)
//@desc fetches file based on file name, readFile() checks certain conditions such as mimetype
router.get('/api/files/:fileid', readFile)

module.exports = { router, reservedKeywords };