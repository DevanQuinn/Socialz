const express = require('express');
const router = express.Router();
const path = require('path');

const notFound = (res) => res.sendFile(path.resolve(__dirname, '..', 'public', 'pages', '_hidden', 'notfound.html'));

router.get('/:page', (req, res) =>
{
    res.sendFile(path.resolve(__dirname, '..', 'public', 'pages', req.params.page + '.html'), err =>
    {
        if (err)
        {
            notFound(res);
        }
    });
    
})

module.exports = router;