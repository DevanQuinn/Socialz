const express = require('express');
const router = express.Router();
const path = require('path');
const bcrypt = require('bcrypt');
const { Account, Profile } = require('../data/mongodb');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');

const notFound = (res) => res.sendFile(path.resolve(__dirname, '..', 'public', 'pages', '_hidden', 'notfound.html'));

router.use(express.json());
router.use(cookieParser());

router.post('/', async (req, res) =>
{

    let { email, username, password1, password2 } = req.body;

    let issues = [];

    await Account.findOne({ $or: [{ email }, { username: username.toLowerCase() }] })
        .select('email username').lean().exec()
        .then((doc) =>
    {
        if (doc)
        {
            if (doc.email == email) issues.push({ id: 0, msg: 'Email already in use.' })
            if (doc.username == username) issues.push({ id: 1, msg: 'Username taken.' })
        }
    }).catch(err => console.log(err));

    if (issues.length != 0) { res.json({success: false, issues: [...issues]}) }    

    else if (!email || !username || !password1 || !password2)
    {
        console.log(req.body)
        res.json({ success: false, issues: [{ id: -1, msg: 'An error has occurred.' }]})
    }

    else
    {
        bcrypt.hash(password1, 10, (err, hash) =>
        {
            if (err) throw err;
            password1 = hash;
            
            const id = mongoose.Types.ObjectId();
            const createdProfile = new Profile({
                _id: id,
                displayName: username,
                location: 'Earth',
                bio: 'I just made a new profile!',
            });

            Account.create({
            _id: id,
            email: email.toLowerCase(),
            username: [username, username.toLowerCase()],
            password: password1
            })
                .then(doc =>
                {
                    if (doc) jwt.sign({ user: { id: doc._id, email: doc.email, username: doc.username[0] } },
                    process.env.JWT_SECRET,
                    (err, token) =>
                    {
                        if (err) res.sendStatus(500);
                        else createdProfile.save()
                            .then(() =>
                            {
                                res.cookie('token', token,
                                    { httpOnly: true, sameSite: 'strict' });
                                res.sendStatus(201);
                            })
                            .catch(err => console.log(err));
                    });
                })
                .catch(err => res.json({ success: false, issues: [{ id: -1, msg: err }] }));
            
        })
    }
    
})

let userCheckCache = [];
let userCheckTimeout;
router.post('/usercheck', (req, res) =>
{
    clearTimeout(userCheckTimeout);
    if (userCheckCache.includes(req.body.email || req.body.username))
    {
        res.send(true);
        return;
    }
    userCheckTimeout = setTimeout(() =>
    {
        Account.findOne(req.body).select('_id').lean().exec().then(doc =>
        {
            if (doc) { userCheckCache.push(req.body.email || req.body.username); res.send(true) }
            else res.send(false);
        }).catch(err => console.log(err));
    }, 200);
})

module.exports = router;