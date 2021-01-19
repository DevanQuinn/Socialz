const express = require('express');
const router = express.Router();
const { Account } = require('../data/mongodb');
const bcrypt = require('bcrypt');
const uuid = require('uuid');
const { sendResetEmail } = require('../data/nodemailer');
const path = require('path');

const notFound = (res) => res.sendFile(path.resolve('public', 'pages', '_hidden', 'notfound.html'));

router.use(express.json());

//@route /api/reset/request
//@desc generates a uuid for reset token and adds it to corresponding account in database (expires after 30m)
router.put('/api/reset/request', async (req, res) =>
{
    const { email, url } = req.body;
    const token = uuid.v4() + '|' + Date.now();
    const doc = await Account.findOneAndUpdate({ email }, { passwordReset: token })
        .select('email').lean().exec();
    if (doc) sendResetEmail(doc.email, `${url}/p/reset/${token}`);
    return res.sendStatus(204);
})

//@route /p/reset/:token
//@param1 token = password reset uuid
//@desc sends page to fill out new password if token is valid
router.get('/p/reset/:token', async (req, res) =>
{
    const { token } = req.params;
    if (Date.now() - token.split('|')[1] > 1800000) notFound(res); //1,800,000ms = 30m

    const doc = await Account.findOne({ passwordReset: token })
        .select('token').lean().exec();
    if (doc) res.sendFile(path.resolve('public', 'pages', '_hidden', 'reset-form.html'));
    else notFound(res);
})

const sendError = (res, message) =>
{
    const obj = {
        status: 400,
        message
    }
    res.json(obj);
}
//@route /api/reset/request/:token
//@param1 token = password reset uuid
//@desc updates hashed password in corresponding account if validation passes
router.put('/api/reset/request/:token', async (req, res) =>
{
    const { token } = req.params;
    const { password1, password2 } = req.body;
    if ((password1 !== password2) || !password1 || !password2)
        return sendError(res, "Passwords don't match.");
    if (password1.length < 6 || !(/\d/.test(password1)))
        return sendError(res, "Password must be greater than five characters and contain at least one digit.");
    if (!token) return sendError(res, "No token provided.");

    bcrypt.hash(password1, 10, (err, hash) =>
    {
        if (err) console.log(err);
        Account.findOneAndUpdate({ passwordReset: token }, { password: hash, passwordReset: undefined })
            .select('email').lean().exec()
            .then(doc =>
            {
                if (!doc) return sendError(res, "Token invalid.");
                return res.json({ status: 204 });
            })
            .catch((err) => console.log(err))
    })
});


module.exports = router;