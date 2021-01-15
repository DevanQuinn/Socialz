const nodemailer = require('nodemailer');

const testAcc = {
    user: process.env.NODEMAILER_EMAIL,
    pass: process.env.NODEMAILER_PASSWORD
};
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: testAcc,
});

const sendSignupEmail = async (email, username) => 
{
    const options =
    {
        from: '"Fred from Mylinked" <noreply@mylinked.io>', // sender address
        to: email, // list of receivers
        subject: `Welcome to Mylinked!`, // Subject line
        text: `Hey ${username}, congrats on making an account with Mylinked.io!`, // plain text body
    }
    transporter.sendMail(options);
}

module.exports = { sendSignupEmail };