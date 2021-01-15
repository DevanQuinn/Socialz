const express = require('express');
const router = express.Router();
const { Account, Profile } = require('../data/mongodb');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');

router.use(cookieParser());
router.use(express.json());

//@route get /
//@desc uses validateToken() in server.js to check if user is currently logged in
router.get('/', (req, res) =>
{
    res.sendStatus(200);
});

//@route get /:field
//@param1: field = account field to search for (email or username)
//@desc gets the provided field from database and sends it to client
router.get('/:field', (req, res) =>
{
    const field = req.params.field.split('-').join(' ');
    Account.findOne({ _id: req.locals.user.id }).select(field).lean().exec()
        .then(doc =>
        {
            if (doc) res.status(200).send({ doc });
        }).catch(() => res.sendStatus(404));
})

//@route delete /
//@desc deletes the current jwt cookie, thereby signing the user out
router.delete('/', (req, res) =>
{
    res.clearCookie('token');
    res.sendStatus(204);
})

module.exports = router;