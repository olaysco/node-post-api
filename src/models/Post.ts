import { Table, Model, DataType, Column, ForeignKey, HasMany, PrimaryKey, AutoIncrement, BelongsTo, DefaultScope } from 'sequelize-typescript';
import sequelize from '../sequelize';
import { Reaction } from './Reaction';

import { User } from "./User";

@DefaultScope(() => ({
	include: [
		{
			model: User,
			attributes: ['email']
		}
	]
}))

@Table
export class Post extends Model {
	@PrimaryKey
	@AutoIncrement
	@Column
	public id!: number;

	@Column
	@ForeignKey(() => User)
	public userId!: number;

	@Column
	public title!: string;

	@Column
	public body!: string;

	@Column
	@ForeignKey(() => Post)
	public parentId!: number;

	@HasMany(() => Post)
	replies!: Post[];

	@HasMany(() => Reaction)
	reactions!: Reaction[];

	@BelongsTo(() => User)
	user!: User;

	public likes!: number
	public loves!: number

	public readonly createdAt!: Date;
	public readonly updatedAt!: Date;
}

export interface PostModel {
	userId: number;
	title: string | null;
	body: string | null;
}

export const PostAttributes: any = [
	"id",
	"title",
	"body",
	"userId",
	"createdAt",
	"updatedAt",
];

Post.init(
	{
		id: {
			type: DataType.BIGINT,
			allowNull: false,
			primaryKey: true,
			autoIncrement: true,
		},

		userId: {
			type: DataType.BIGINT,
			allowNull: false,
		},

		title: {
			type: DataType.STRING,
			allowNull: true,
		},

		parentId: {
			type: DataType.BIGINT,
			allowNull: true,
		},

		body: {
			type: DataType.TEXT,
			allowNull: false,
		},

	},
	{
		sequelize,
		modelName: "Post",
	}
);
