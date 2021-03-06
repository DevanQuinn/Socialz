const express = require('express');
const app = express();
const path = require('path');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const cors = require('cors')

const PORT = process.env.PORT || 3000;


app.use(express.json());
app.use(express.static('public'));
app.use(express.static('src'));
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(cors());

app.set('case sensitive routing', false);

const validateToken = (req, res, next) =>
{
    res.header('Access-Control-Allow-Origin', '*')
    const token = req.cookies.token;
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) =>
    {
        if (err) res.sendStatus(403);
        else if (decoded)
        {
            req.locals = decoded;
            next();
        };
        })
}

app.get('/',  (req, res) =>
{
    res.sendFile(path.resolve(__dirname, 'public', 'index.html'));
})


app.use('/', require('./routes/profile-fetch').router);

app.use('/p/', require('./routes/page'));

app.use('/api/signup/submit/', require('./routes/auth-signup'));

app.use('/api/login/submit/', require('./routes/auth-login'));

app.use('/api/dashboard/request', validateToken, require('./routes/dashboard-fetch'));

app.use('/api/cookies/request', validateToken, require('./routes/cookies'));

app.use('/', require('./routes/reset-fetch'));

app.listen(PORT, () => console.log(`Listening on port ${PORT}`));