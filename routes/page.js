const express = require('express');
const router = express.Router();
const path = require('path');

const notFound = (res) => res.sendFile(path.resolve(__dirname, '..', 'public', 'pages', '_hidden', 'notfound.html'));

//@route get /:page
//@param1 page = html filename
//@desc sends corresponding html file to be displayed to client (ex. /contact sends contact.html)
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