const express = require('express');
const app = express();
const path = require('path');

const PORT = process.env.PORT || 3000;


const socials = {
    devan: [{ name: 'Tiktok', link: 'https://tiktok.com/@devanthedank', image: '../../src/social-media/tiktok_final.png'},
        { name: 'Twitter', link: 'https://twitter.com/devanqueue', image: '../../src/social-media/twitter_final.png' },
    { name: 'Twitch', link: 'https://twitch.tv/devanqueue', image: '../../src/social-media/youtube_final.png'}]
};
    
const userData = {
    devan: { displayName: 'Devan', location: 'Hoboken NJ', bio: 'Creator of cherrylink.io', pfp: '../../src/pfp.png' }
}

const reservedKeywords = ['p'];

app.use(express.json());
app.use(express.static('public'));
app.use(express.static('src'));

app.set('case sensitive routing', false);

const notFound = (res) => res.sendFile(path.resolve(__dirname, 'public', 'pages', '_hidden', 'notfound.html'));

app.get('/',  (req, res) =>
{
    res.sendFile(path.resolve(__dirname, 'public', 'index.html'));
})

app.get('/p/:page', (req, res) =>
{
    res.sendFile(path.resolve(__dirname, 'public', 'pages', req.params.page + '.html'), err =>
    {
        if (err)
        {
            notFound(res);
        }
    });
    
})

app.get('/:username', (req, res, next) =>
{
    const username = req.params.username.toLowerCase();
    if (socials[username] && !reservedKeywords.find(val => val === username))
    {
        res.sendFile(path.resolve(__dirname, 'public', 'pages', '_hidden', 'profile.html'));
    } else
    {
        notFound(res);
    }
})

app.get('/api/:username', (req, res) =>
{
    const username = req.params.username;
    res.json([userData[username], socials[username]]);
    
})

app.listen(PORT, () => console.log(`Listening on port ${PORT}`));