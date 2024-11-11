const nodemailer = require('nodemailer');
const crypto = require('crypto');

const sendVerificationEmail = (user, req, res) => {
    const token = crypto.randomBytes(16).toString('hex');
    user.verificationToken = token;
    user.save();

    const transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
            user: process.env.EMAIL,
            pass: process.env.EMAIL_PASSWORD
        }
    });

    const mailOptions = {
        from: process.env.EMAIL,
        to: user.email,
        subject: 'Account Verification',
        text: `Hello ${user.username},Please verify your account by clicking the link: \nhttp:\/\/${req.headers.host}\/api\/users\/verify-email\/${token}\n\nThank You!\n`
    };

    transporter.sendMail(mailOptions, (err) => {
        if (err) {
            console.error('Error sending email:', err);
            return res.status(500).json({ msg: 'Technical issue! Please click on resend for verify your Email.' });
        }
        res.status(200).json({ msg: 'A verification email has been sent to ' + user.email + '.' });
    });
};

module.exports = sendVerificationEmail;
