import { Sequelize } from 'sequelize-typescript';
import { config } from './config';

let sequelizeInstance: Sequelize;

if (config.isProduction) {
	sequelizeInstance = new Sequelize(config.database, config.username, config.password, {
		dialect: 'mysql',
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
