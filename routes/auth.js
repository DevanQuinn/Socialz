const express = require('express');
const router = express.Router();
const path = require('path');

const notFound = (res) => res.sendFile(path.resolve(__dirname, '..', 'public', 'pages', '_hidden', 'notfound.html'));

router.post('/', (req, res) =>
{
    res.send(req.body);
})

module.exports = router;