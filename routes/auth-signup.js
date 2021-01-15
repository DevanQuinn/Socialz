const express = require('express');
const router = express.Router();
const path = require('path');
const bcrypt = require('bcrypt');
const { Account, Profile } = require('../data/mongodb');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const reservedKeywords = require('./profile-fetch').reservedKeywords;
const { sendSignupEmail } = require('../data/nodemailer');

const notFound = (res) => res.sendFile(path.resolve(__dirname, '..', 'public', 'pages', '_hidden', 'notfound.html'));

router.use(express.json());
router.use(cookieParser());

//@route post /
//@desc create account by making 2 mongoose models and hashing password
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
                avatar: '5ffbe86d0d96dd37f882fcc8',
                color: '#f468f6',
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
                                //Send email through nodemailer
                                sendSignupEmail(email, username).catch(console.error)
                                res.cookie('token', token,
                                    { httpOnly: true, sameSite: 'strict' });
                                res.status(201).send({ success: true });
                            })
                            .catch(err => console.log(err));
                    });
                })
                .catch(err => res.json({ success: false, issues: [{ id: -1, msg: "An error has occurred." }] }));
            
        })
    }
    
})

//@route post /usercheck
//@desc FIXME: debounce checking of username to prevent excessive database queries, uses simple caching
let userCheckCache = [];
let userCheckTimeout;
router.post('/usercheck', (req, res) =>
{
    clearTimeout(userCheckTimeout);
    if (userCheckCache.includes(req.body.email || req.body.username) || reservedKeywords.includes(req.body.username))
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