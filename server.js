const express = require('express');
const app = express();
const path = require('path');

const PORT = process.env.PORT || 3000;

const socials = {
    devan: [{ name: 'Tiktok', link: 'https://tiktok.com/@devanthedank' },
    { name: 'Twitch', link: 'https://twitch.tv/devanqueue' }]};

app.use(express.json());
app.use(express.static('public'));
app.use(express.static('src'));

app.get('/',  (req, res) =>
{
    res.sendFile(path.resolve(__dirname, 'public', 'index.html'));
})

app.get('/:page', (req, res) =>
{
    res.sendFile(path.resolve(__dirname, 'public', req.params.page + '.html'), err =>
    {
        if (err)
        {
            res.send('404 Not Found');
            console.log(err)
        }
    });
    
})

app.get('/api/:username', (req, res) =>
{
    const username = req.params.username;
    res.json(socials[username]);
})

app.listen(PORT, () => console.log(`Listening on port ${PORT}`));