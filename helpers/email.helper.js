import dotenv from "dotenv";
dotenv.config();

import nodemailer from "nodemailer";
console.log(process.env.EMAIL_SMTP);
// create reusable transporter object using the default SMTP transport
let transporter = nodemailer.createTransport({
	host: process.env.EMAIL_SMTP,
	port: 587,
	// secure: false, // true for 465, false for other ports
	auth: {
		user: process.env.EMAIL_USER, // generated ethereal user
		pass: process.env.EMAIL_PASSWORD, // generated ethereal password
	},
});

// async..await is not allowed in global scope, must use a wrapper
const send = async mailInfo => {
	try {
		// Generate test SMTP service account from ethereal.email
		// send mail with defined transport object
		let info = await transporter.sendMail(mailInfo);

		console.log("Message sent: %s", info.messageId);
		// Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

		// Preview only available when sending through an Ethereal account
		console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
		// Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
	} catch (error) {
		console.log(error);
	}
};

export const emailProcessor = ({ type, ...data }) => {
	console.log("from email processer", type, data);
	let info = {
		from: `ABC Shop <${process.env.EMAIL_USER}>`, // sender address
		to: "bar@example.com, baz@example.com", // list of receivers
		subject: "Hello ✔", // Subject line
		text: "Hello world?", // plain text body
		html: "<b>Hello world?</b>", // html body
	};

	switch (type) {
		case "OTP_REQUEST":
			info = {
				to: data.email,
				subject: "OTP for your password rest request",
				text: `Hi, here is the OTP for your password reset, ${data.otp} this token will expire in 1 day `,
				html: `
        <div>
        <p>Hello there,</p>
        <p>here is the OTP for your password reset </p>
        <p style="background: ;background: red;display: inline;padding: 10px;color: wheat;font-weight: 900;">${data.otp}</p>
        <p>regards,</p>
      </div>
        `,
			};
			send(info);
			break;

		case "UPDATE_PASS_SUCCESS":
			info = {
				to: data.email,
				subject: "Password update notification",
				text: `Hi,  this is to notify that you password at ABC Shop has been changed just now.  IF you do not recognize this activity, please contact us ASAP `,
				html: `
        <div>
        <p>Hello there,</p>
        <p>this is to notify that you password at ABC Shop has been changed just now. </p>

				<p>IF you do not recognize this activity, please contact us ASAP</p>
        <p>regards,</p>
      </div>`,
			};
			send(info);
			break;

		default:
			break;
	}
};
