const mongoose = require('mongoose');
require('dotenv').config()
const username = process.env.DB_USER;
const password = process.env.DB_PASS;
const uri = `mongodb+srv://${username}:${password}@socialz.ympda.mongodb.net/Socialz?retryWrites=true&w=majority`;
const Grid = require('gridfs-stream');
const GridFsStorage = require('multer-gridfs-storage');
const sharp = require('sharp');

let gfs;

// mongoose.connect(uri, {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
//     useFindAndModify: false,
//     useCreateIndex: true
// }).then((db) =>
// {
//     gfs = Grid(db.db, mongoose.mongo);
//     gfs.collection('uploads');
//     console.log('connected')
// }, err => console.log(err));

const conn = mongoose.createConnection(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true
})
conn.once('open', () =>
{
    console.log('connected')
    gfs = Grid(conn.db, mongoose.mongo);
    // gfs.collection('uploads');
})

const readFile = (req, res) =>
{
    const _id = mongoose.Types.ObjectId(req.params.fileid.toString());
    gfs.files.findOne({ _id }, (err, file) =>
    {
        if (!file || file.length == 0)
        {
            return res.sendStatus(404);
        }
        if (file.contentType === 'image/jpeg' || file.contentType === 'image/png')
        {
            const readstream = gfs.createReadStream(file.filename);
            readstream.pipe(res);
        }
        else res.sendStatus(404);

    })
}

const storage = new GridFsStorage({
    url: uri,
    file: async (req, file) =>
    {
        if (!file) return null;
        const types = ['image/jpeg', 'image/png', 'image/jpg'];
        if (!types.includes(file.mimetype)) return null;
        
        const userid = req.locals.user.id;
        const avatar = await Profile.findById(userid).select('avatar').lean().exec();
        gfs.remove({ _id: mongoose.Types.ObjectId(avatar.avatar).toString() })
        const filename = 'file_' + Date.now();
        file.filename = filename;
        return { filename };
    }
});

const accountSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    email: { type: String, unique: true },
    username: { type: [String], unique: true },
    password: String,
    creationDate: { type: Date, default: Date.now }
});
const Account = conn.model('Account', accountSchema, 'Accounts');

const socialSchema = new mongoose.Schema({
    name: String,
    link: String,
    img: {
        data: Buffer,
        contentType: String,
    }
});
const SubSocial = conn.model('socials', socialSchema);
const profileSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    displayName: String,
    location: String,
    bio: String,
    socials: [socialSchema],
    avatar: String,
    color: String,
});
const Profile = conn.model('Profile', profileSchema, 'Profiles');


module.exports = { Account, Profile, SubSocial, storage, gfs, readFile };