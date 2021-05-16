import cors from 'cors';
import express from 'express';
import sequelize from './sequelize';

import { config } from './config';
import router from './http/routes/index';
import { MODELS } from './models/index';
import { MediaRouter } from './http/routes/media';

export const server = async () => {
	await sequelize.addModels(MODELS);
	await sequelize.sync();

	const app = express();

	app.use(express.urlencoded({ extended: true }));
	app.use(express.json());

	app.use(cors({
		allowedHeaders: [
			'Origin', 'X-Requested-With',
			'Content-Type', 'Accept',
			'X-Access-Token', 'Authorization',
		],
		methods: 'GET,HEAD,OPTIONS,PUT,PATCH,POST,DELETE',
		origin: config.url,
	}));

	app.use('/api/v1/', router);
	app.use('/uploads', MediaRouter);

	return app;
};
