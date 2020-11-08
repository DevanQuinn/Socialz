const express = require('express');
const app = express();
const path = require('path');


const PORT = process.env.PORT || 3000;


app.use(express.json());
app.use(express.static('public'));
app.use(express.static('src'));

app.set('case sensitive routing', false);

app.get('/',  (req, res) =>
{
    res.sendFile(path.resolve(__dirname, 'public', 'index.html'));
})


app.use('/', require('./routes/user'));

app.use('/p/', require('./routes/page'));

app.listen(PORT, () => console.log(`Listening on port ${PORT}`));