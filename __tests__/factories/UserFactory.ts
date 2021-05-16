import { User } from '../../src/models/User'
import faker from 'faker'

const data = async (props: object = {}): Promise<object> => {
	const defaultProps = {
		email: faker.internet.email(),
	};
	return Object.assign({}, defaultProps, props);
};

export default async (props: object = {}): Promise<User> => User.create(await data(props));
