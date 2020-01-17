var nodemailer = require("nodemailer");
module.exports = async function (email, verify) {
    var transporter = nodemailer.createTransport({
        service: 'gmail',
        // host: "gmail.com",
        auth: {
            user: "ceomern@gmail.com",
            pass: "ceomern2019"
        }
    });

    var mailOptions = {
        from: "ceomern@gmail.com",
        to: email,
        subject: "M BILL",
        text: verify 
    };

    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error);
        } else {
            console.log("Email sent: " + info.response);
        }
    });
};