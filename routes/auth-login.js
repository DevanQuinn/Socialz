const express = require('express');
const router = express.Router();
const path = require('path');
const bcrypt = require('bcrypt');
const { Account } = require('../data/mongodb');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');

router.use(express.json());
router.use(cookieParser());

router.post('/', (req, res) =>
{
    const { username, password } = req.body;
    Account.findOne({ username: username.toLowerCase() }).lean().exec().then((doc) =>
    {
        if (doc)
        {
            bcrypt.compare(password, doc.password, (err, result) =>
            {
                if (err) console.log(err);

                if (result) jwt.sign({ user: { id: doc._id, email: doc.email, username: doc.username[0] } },
                    process.env.JWT_SECRET,
                    (err, token) =>
                    {
                        if (err) console.log(err);
                    res.cookie('token', token,
                        { httpOnly: true, sameSite: 'strict' });
                        res.sendStatus(200);
                });
                
                else res.status(404).send();
            })
        } else res.status(404).send();
    }).catch(err => console.log(err));
})

module.exports = router;