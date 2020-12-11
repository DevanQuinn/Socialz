const mongoose = require('mongoose');
require('dotenv').config()
const username = process.env.DB_USER;
const password = process.env.DB_PASS;
const uri = `mongodb+srv://${username}:${password}@socialz.ympda.mongodb.net/Socialz?retryWrites=true&w=majority`;

mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true
}).then(() => console.log('connected'), err => console.log(err));

const accountSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    email: String,
    username: [String],
    password: String,
    creationDate: { type: Date, default: Date.now }
});
const Account = mongoose.model('Account', accountSchema, 'Accounts');

const socialSchema = new mongoose.Schema({
    name: String,
    link: String,
    img: {
        data: Buffer,
        contentType: String,
    },
    orderIndex: Number
});
const SubSocial = mongoose.model('socials', socialSchema);
const profileSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    displayName: String,
    location: String,
    bio: String,
    socials: [socialSchema],
});
const Profile = mongoose.model('Profile', profileSchema, 'Profiles');


module.exports = { Account, Profile, SubSocial };