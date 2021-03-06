import { Request, Response } from 'express';
import { Controller } from './Controller';
import { Auth as Service } from '../../services/Auth';
import { User } from '../../../src/models/User';
import SendEmail from '../../services/Mail';
import * as EmailValidator from 'email-validator';
import { Op } from 'sequelize';

class Auth extends Controller {

	/**
	 * Registers a new user
	 * 
	 * @param req Request
	 * @param res Response
	 * @returns Promise<Response<any, Record<string, any>>>
	 */
	public async register(req: Request, res: Response): Promise<Response<any, Record<string, any>>> {
		const email = req.body.email;
		const plainTextPassword = req.body.password;

		if (!email || !EmailValidator.validate(email)) {
			return res.status(400).send({ auth: false, message: 'Email is missing or malformed.' });
		}

		if (!plainTextPassword) {
			return res.status(400).send({ auth: false, message: 'Password is required.' });
		}

		const user = await User.findOne({where:{email}});
		if (user) {
			return res.status(422).send({ auth: false, message: 'User already exists.' });
		}

		const generatedHash = await Service.generatePassword(plainTextPassword);

		const newUser = User.build({
			email: email,
			passwordHash: generatedHash,
		});

		const savedUser = await newUser.save();

		//Allow response to be sent to user without waiting for email
		SendEmail.sendWelcomeEmail(email);

		const jwt = Service.generateJWT(savedUser.short());
		return res.status(201).send({ token: jwt, user: savedUser.short() });
	}

	/**
	 * Authenticate a new user
	 * 
	 * @param req Request
	 * @param res Response
	 * @returns Promise<Response<any, Record<string, any>>>
	 */
	public async login(req: Request, res: Response): Promise<Response<any, Record<string, any>>> {
		const email = req.body.email;
		const password = req.body.password;

		if (!email || !EmailValidator.validate(email)) {
			return res.status(400).send({ auth: false, message: 'Email is required or malformed.' });
		}

		if (!password) {
			return res.status(400).send({ auth: false, message: 'Password is required.' });
		}

		const user = await User.findOne({where:{email}});
		console.log(await User.findAll({ where: {id: {[Op.not]: null}}}));
		if (!user) {
			return res.status(401).send({ auth: false, message: 'User was not found..' });
		}

		const authValid = await Service.comparePasswords(password, user.passwordHash);

		if (!authValid) {
			return res.status(401).send({ auth: false, message: 'Password was invalid.' });
		}

		const jwt = Service.generateJWT(user.short());
		return res.status(200).send({ auth: true, token: jwt, user: user.short() });
	}

	/**
	 * Authorizes a user for password reset
	 * 
	 * @param req Request
	 * @param res Response
	 * @returns Promise<any>
	 */
	public async resetPassword(req: Request, res: Response): Promise<any> {
		try {
			const email = req.body.email;

			if (!email || !EmailValidator.validate(email)) {
				return res.status(400).send({ auth: false, message: 'Email is required or malformed.' });
			}

			const user = await User.findOne({where:{email}});
			if (user) {
				const token = await Service.generateJWT(user.short(), "1h");
				await SendEmail.SendResetEmail(email, req.hostname, token);

				return res.status(200).send({
					success: true,
					message:
						"Password reset link set to email."
				});
			}
		} catch (err) {
			return res.status(500).send({
				success: false,
				message: "Internal Server Error"
			});
		}
	}

	/**
	 * Verify a user is authorized to perform an action
	 * 
	 * @param req Request
	 * @param res Response
	 * @returns Promise<Response>
	 */
	public async verify(req: Request, res: Response): Promise<Response> {
		return res.status(200).send({ auth: true, message: 'Authenticated.' });
	}

	/**
	 * Updates users password
	 * 
	 * @param req Request
	 * @param res Response
	 * @returns Promise<Response>
	 */
	public async updatePassword(req: Request, res: Response): Promise<Response> {
		const email = req.body.email;
		const newPassword = req.body.newPassword;

		try {
			const user = await User.findOne({where:{email}});
			if (user) {
				const generatedHash = await Service.generatePassword(newPassword);
				user.passwordHash = generatedHash;
				await user.save();
				return res.status(200).send({
					success: true,
					message: "Password successfully reset"
				});
			}

			return res.status(400).send({
				success: false,
				message: "Incorrect Email"
			});
		} catch (err) {
			return res.status(500).send({
				success: false,
				message: "Internal Server Error"
			});
		}
	}
}

export default new Auth;
