const express = require('express');
const router = express.Router();
const path = require('path');
const bcrypt = require('bcrypt');

const notFound = (res) => res.sendFile(path.resolve(__dirname, '..', 'public', 'pages', '_hidden', 'notfound.html'));

router.post('/', (req, res) =>
{
    const emails = ['devan@gmail.com'];
    const usernames = ['devan'];

    let { email, username, password, password2 } = req.body;

    let issues = [];
    let query = undefined;
    if (emails.includes(email))
    {
        issues.push('email');
    } if (usernames.includes(username))
    {
        issues.push('username');
    }

    issues.forEach((e) =>
    {
        console.log(e);
        if (query) query += '&' + e;
        else query = e;
    })
    if (query) { res.redirect('/p/signup?' + query); return; };

    if (!email || !username || !password || !password2)
    {
        res.redirect('/p/signup?error');
    }

    bcrypt.hash(password, 10, (err, hash) =>
    {
        if (err) throw err;
        password = hash;
        res.send(password);
    })
})

module.exports = router;