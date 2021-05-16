import { Table, Column, Model, PrimaryKey, CreatedAt, UpdatedAt, AutoIncrement, ForeignKey, BelongsTo, Index, Scopes, DefaultScope } from 'sequelize-typescript';
import { Post } from './Post';
import { ReactionType } from './ReactionType';
import { User } from "./User";

@Scopes(() => ({
	likes: {
		where: {
			type: ReactionType.Like
		}
	},
	loves: {
		where: {
			type: ReactionType.Love
		}
	}
}))

@DefaultScope(() => ({
	include: [
		{
			model: User,
			attributes: ['email']
		}
	]
}))

@Table
export class Reaction extends Model {

	@PrimaryKey
	@AutoIncrement
	@Column
	public id!: number;

	@Column
	public type!: number;

	@Column
	@Index({
		name: 'user-post-reaction'
	})
	@ForeignKey(() => User)
	public userId!: number;

	@Column
	@Index({
		name: 'user-post-reaction'
	})
	@ForeignKey(() => Post)
	public postId!: number;

	@BelongsTo(() => User)
	user!: User;

	@Column
	@CreatedAt
	public createdAt: Date = new Date();

	@Column
	@UpdatedAt
	public updatedAt: Date = new Date();

	@BelongsTo(() => Post)
	post!: Post;

	short() {
		return {
			type: this.type,
			user: this.user,
			postId: this.postId
		};
	}
}
