import UserFactory from './UserFactory';
import { Auth } from '../../src/services/Auth';
import { User } from '../../src/models/User';

export interface AuthUser {
	token: string;
	user: User;
}

export default async (props: object = {}): Promise<AuthUser> => {
	const user = await UserFactory(props)
	const token = Auth.generateJWT(user.short())
	return {token, user}
}
