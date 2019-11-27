const nodemailer = require('nodemailer');
require('dotenv').config();

const transporter = nodemailer.createTransport({
	host: 'smtp.ethereal.email',
	port: 587,
	auth: {
		user: process.env.ETHEREAL_SENDER,
		pass: process.env.ETHEREAL_PASS
	}
});

module.exports = {
	send: (req, res) => {
		const { to, subject, name, auth0_id } = req.body;
		const mailOptions = {
			from: 'ticketing@test.com',
			to,
			subject,
			html: `
            <div style='display: flex; justify-content: center; align-items: center; height: 100px; background-color: #5e1742; font-family: sans-serif;>
            <h1 style='color: white; font-size: 42px;'>
            
            </h1>
            </div><br>
            <h1 style='font-size: 32px;'>Thank you for your purchase!</h1><br>
            
            <p>${name},</p><br>
            <p>Hey there!  This e-mail is a confirmation of your ticket purchase as well as a copy of your digital tickets. Please keep a copy of this e-mail, digital or otherwise, for the time of entry into the ticketed event. We stand by the quality of our services, and hope to provide the best experience possible with the least hassle.  Please reply to us at this address and we will be glad to assist you with any questions or concerns related to your ticket purchase. You will find a summary of your order below.</p><br>
            <p>Sincerely,</p><br>
            <p>Ticket Peoples</p><br>`
		};
		transporter.sendMail(mailOptions, (error, response) => {
			if (error) {
				console.log('Error on sendMail in nodemailer', error);
			} else {
				console.log('Email sent successfully', response);
				req.app.get('db').clear_cart([auth0_id]);
			}
		});
	}
};
