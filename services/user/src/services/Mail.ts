import { config } from '../config';
let Mailgun = require('mailgun-js');

interface mailBody {
	from: string,
	to: string,
	subject: string,
	html: string
}

class SendEmail {

	static async sendWelcomeEmail(email: string) {
		let details: mailBody = {
			from: config.mail_from,
			to: email,
			subject: 'Welcome to QL post',
			html: `<h1>Welcome to QL post</h1> <p>Your email ${email} has been successfully setup, you can now login</p>`
		}
		return this.send(details);
	}

	static async SendResetEmail(email: string, hostname: string, token: string) {
		let details: mailBody = {
			from: config.mail_from,
			to: email,
			subject: 'Password Reset',
			html: `<h1>Password Reset Link</h1> <p><a href= "https://${hostname}/auth/reset_pwd?token=${token}"> Click to reset password </a></p>`
		}

		return this.send(details)
	}

	static async send(details: mailBody) {
		const mailgun = new Mailgun({ apiKey: config.mail_api_key, domain: config.mail_domain });
		mailgun.messages().send(details, function (error: any, body: any) {
			console.log(body, error);
		});
	}
}

export default SendEmail;
