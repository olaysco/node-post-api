import {Table, Column, Model, PrimaryKey, CreatedAt, UpdatedAt, HasMany, AutoIncrement, Unique} from 'sequelize-typescript';
import { Post } from './Post';

@Table
export class User extends Model<User> {

	@PrimaryKey
	@AutoIncrement
	@Column
	public id!: number;

	@Unique
  @Column
  public email!: string;

  @Column
  public passwordHash!: string;

  @Column
  @CreatedAt
  public createdAt: Date = new Date();

  @Column
  @UpdatedAt
	public updatedAt: Date = new Date();
	
	@HasMany(() => Post)
	posts!: Post[];

  short() {
    return {
			email: this.email,
			id: this.id,
    };
  }
}
