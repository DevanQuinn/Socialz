const express = require('express');
const router = express.Router();
const path = require('path');

const socials = {
    devan: [{ name: 'Tiktok', link: 'https://tiktok.com/@devanthedank', image: '../../src/social-media/tiktok_final.png'},
        { name: 'Twitter', link: 'https://twitter.com/devanqueue', image: '../../src/social-media/twitter_final.png' },
        { name: 'Twitch', link: 'https://twitch.tv/devanqueue', image: '../../src/social-media/twitch_final.png' },
    {name: 'Discord', link: 'https://discord.gg/qp8tBhM6Sg', image: '../../src/social-media/discord_final.png'}]
};
    
const userData = {
    devan: { displayName: 'Devan', location: 'Hoboken NJ', bio: 'Creator of cherrylink.io', pfp: '../../src/pfp.png' }
}

const reservedKeywords = ['p'];

const notFound = (res) => res.sendFile(path.resolve(__dirname, '..', 'public', 'pages', '_hidden', 'notfound.html'));

router.get('/:username', (req, res, next) =>
{
    const username = req.params.username.toLowerCase();
    if (socials[username] && !reservedKeywords.find(val => val === username))
    {
        res.sendFile(path.resolve(__dirname, '..', 'public', 'pages', '_hidden', 'profile.html'));
    } else
    {
        notFound(res);
    }
})

router.get('/api/:username', (req, res) =>
{
    const username = req.params.username;
    res.json([userData[username], socials[username]]);
    
})

module.exports = router;