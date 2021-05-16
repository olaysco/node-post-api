import * as bcrypt from 'bcrypt';
import * as c from '../config';
import * as jwt from 'jsonwebtoken';

export class Auth {

	static async generatePassword(plainTextPassword: string): Promise<string> {
		const saltRounds = 10;
		const salt = await bcrypt.genSalt(saltRounds);
		return await bcrypt.hash(plainTextPassword, salt);
	}

	static async comparePasswords(plainTextPassword: string, hash: string): Promise<boolean> {
		return await bcrypt.compare(plainTextPassword, hash);
	}

	static generateJWT(payload: any, expiresIn: string = "24h"): string {
  		return jwt.sign(payload, c.config.jwt.secret, {expiresIn});
	}
}
