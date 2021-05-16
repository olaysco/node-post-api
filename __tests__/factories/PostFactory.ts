import { Post } from '../../src/models/Post'
import faker from 'faker'
import UserFactory from './UserFactory';

const data = async (props: object = {}): Promise<object> => {
	const user = await UserFactory()
	const defaultProps = {
		userId: user.id,
		body: faker.lorem.sentence(),
		title: faker.lorem.word()
	};
	return Object.assign({}, defaultProps, props);
};

export default async (props: object = {}, create = true): Promise<any> => (create) ? Post.create(await data(props)) : await data(props);
