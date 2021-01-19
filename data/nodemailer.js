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
        from: '"Fred from myLinked" <noreply@mylinked.io>', // sender address
        to: email, // list of receivers
        subject: `Welcome to myLinked!`, // Subject line
        text: `Hey ${username}, congrats on making an account with myLinked.io!`, // plain text body
    }
    transporter.sendMail(options);
}

const sendResetEmail = async (email, tokenLink) =>
{
    const options = {
        from: '"Bert from myLinked" <passwords@mylinked.io>',
        to: email,
        subject: 'Reset myLinked.io Password',
        html: `<h2>Follow the link below to reset your password:</h2>
        <a href="${tokenLink}" target="_blank">${tokenLink}</a>
        <h3>Sincerely, <br/>Bert the Security Bot 🤖</h3>
        <h3>P.S. the link expires in 30 minutes (for, you know, security)</h3>
        <h4 style="color: grey">If you have no idea why you got this email or no longer wish to change your password, please ignore this email.</h4>
        `
    }
    transporter.sendMail(options);
}

module.exports = { sendSignupEmail, sendResetEmail };