import { Sequelize } from 'sequelize-typescript';
import { config } from './config';

let sequelizeInstance: Sequelize;

if (config.isProduction) {
	sequelizeInstance = new Sequelize(config.database, config.username, config.password, {
		dialect: 'mysql'
	});
} else {
	sequelizeInstance = new Sequelize({
		dialect: 'sqlite',
		storage: './database.sqlite'
	});
}

export default sequelizeInstance
