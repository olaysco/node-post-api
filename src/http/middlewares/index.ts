import * as c from '../../config';
import * as jwt from 'jsonwebtoken';
import { NextFunction } from "connect";
import { Request, Response } from 'express'

export function requireAuth(req: Request, res: Response, next: NextFunction): any {
	if (!req.headers || !req.headers.authorization) {
		return res.status(401).send({ message: 'No authorization headers.' });
	}

	const tokenBearer = req.headers.authorization.split(' ');
	if (tokenBearer.length != 2) {
		return res.status(401).send({ message: 'Malformed token.' });
	}

	const token = tokenBearer[1];
	return jwt.verify(token, c.config.jwt.secret, (err, decoded) => {
		if (err) {
			return res.status(500).send({ auth: false, message: 'Failed to authenticate.' });
		}
		req.body.decoded = decoded;
		return next();
	});
}
