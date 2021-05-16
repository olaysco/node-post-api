import { Sequelize } from 'sequelize-typescript';
import { config } from './config';

let sequelizeInstance: Sequelize;

if (config.isProduction) {
	sequelizeInstance = new Sequelize(config.db_name, config.db_username, config.db_password, {
		host: config.db_host,
		// @ts-expect-error
		port: config.db_port,
		// @ts-expect-error
		dialect: config.dialect,
		logging: false
	});
} else {
	sequelizeInstance = new Sequelize({
		dialect: 'sqlite',
		storage: './database.sqlite',
		logging: false
	});
}

export default sequelizeInstance
