import { config } from '../config';
import nodemailer, { Transporter } from 'nodemailer';

interface MailBody {
	from: string;
	to: string;
	subject: string;
	html: string;
}

class SendEmail {

	public static transport: Transporter

	static async sendWelcomeEmail(email: string): Promise<void> {
		const details: MailBody = {
			from: config.mail_from,
			to: email,
			subject: 'Welcome to QL post',
			html: `<h1>Welcome to QL post</h1> <p>Your email ${email} has been successfully setup, you can now login</p>`
		}
		await this.send(details);
		return;
	}

	static async SendResetEmail(email: string, hostname: string, token: string): Promise<void> {
		const details: MailBody = {
			from: config.mail_from,
			to: email,
			subject: 'Password Reset',
			html: `<h1>Password Reset Link</h1> <p><a href= "https://${hostname}/auth/reset_pwd?token=${token}"> Click to reset password </a></p>`
		}

		await this.send(details)
		return;
	}

	static async send(details: MailBody): Promise<Array<string>|null> {
		const result = await SendEmail.getTransport().sendMail(details)
		return result?.accepted
	}

	static getTransport(): Transporter {
		if (!this.transport) {
			this.transport = nodemailer.createTransport({
				// @ts-expect-error ignore non-matching TransportOptions
				host: config.mail_host,
				port: config.mail_password,
				auth: {
					user: config.mail_username,
					pass: config.mail_password
				}
			});
		}
		return this.transport
	}
}

export default SendEmail;
