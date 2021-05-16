import { Request, Response } from 'express';
import { Post as Model, PostAttributes } from '../../models/Post';
import { Controller } from './Controller';
import { Reaction } from '../../models/Reaction';
import { ReactionType } from '../../models/ReactionType';

class Post extends Controller {

	public async index(req: Request, res: Response) {
		try {
			const { page, size, ...rest } = req.query;
			const posts = await Model.findAndCountAll({
				include: [{ model: Model, attributes: ['body'] }, {
					model: Reaction,
					attributes: ['type'],
					required: false
				}],
				where: { parentId: null, ...rest },
				attributes: PostAttributes,
				order: [["updatedAt", "DESC"]],
				...Post.paginate(Number(page ?? 1), Number(size ?? 15))
			});

			const results = Post.transform(posts);

			res.status(200).send({
				count: posts.count,
				data: results,
				currentPage: page || 1,
				totalPage: Post.totalPage(posts.count, Number(size ?? 15)),
				success: true,
			});
		} catch (err: any) {
			res.status(500).send({
				message: err.message,
				success: false,
			});
		}
	}

	public async store(req: Request, res: Response) {
		try {
			const { title, body } = req.body;
			if (!body) {
				return res.status(400).send({ message: "Post body is required", success: false });
			}

			let data = await Model.create({
				userId: req.body.decoded.id,
				title: title ?? "",
				body,
			})
			return res.status(201).send({ data: data.toJSON(), message: "Post successfully posted", success: true });
		} catch (err: any) {
			return res.status(500).send({
				message: `unable to create post because, ${err.message}`,
				success: false,
			});
		}
	}

	public async get(req: Request, res: Response) {
		try {
			const { id } = req.params;
			const { page, size, ...rest } = req.query;
			const post = await Model.findByPk(id);

			if (post) {
				return res.status(200).send({
					data: post?.toJSON(),
					success: true,
				});
			}

			return res.status(404).send({
				message: 'Post not found',
				success: false,
			});


		} catch (err: any) {
			return res.status(500).send({
				message: err.message,
				success: false,
			});
		}
	}

	public async update(req: Request, res: Response) {
		try {
			const { id } = req.params;
			const { title, body } = req.body;

			const post = await Model.findByPk(id);
			if (post) {
				await post.update({
					title: title ?? post.title,
					body: body ?? post.body
				});
				return res.status(200).send({
					data: post.toJSON(),
					success: true,
				});
			}
			return res.status(404).send({
				message: 'Post not found',
				success: false,
			});
		} catch (err: any) {
			return res.status(500).send({
				message: err.message,
				success: false,
			});
		}
	}

	public async delete(req: Request, res: Response) {
		try {
			const { id } = req.params;
			const post = await Model.findByPk(id);
			if (post) {
				await post.destroy();
				return res.status(200).send({
					message: 'Post Deleted',
					success: true,
				});
			}
			return res.status(404).send({
				message: 'Post not found',
				success: false,
			});
		} catch (err: any) {
			return res.status(500).send({
				message: err.message,
				success: false,
			});
		}
	}

	public async reply(req: Request, res: Response) {
		try {
			const { id } = req.params;
			const { body } = req.body;
			if (!body) {
				return res.status(400).send({ message: "Reply body is required", success: false });
			}

			const post = await Post.findOrFailByPk(id, res);
			if (post) {
				if (post.parentId !== null) {
					return res.status(403).send({ message: "You can only reply to a top level post", success: false });
				}
				const data = await Model.create({
					userId: req.body.decoded.id,
					body,
					parentId: post.id
				});
				return res.status(201).send({ data, message: "Reply successfully posted", success: true });
			}
			return;
		} catch (err: any) {
			return res.status(500).send({
				message: err.message,
				success: false,
			});
		}
	}

	public async react(req: Request, res: Response) {
		try {
			const { reaction } = req.body;
			const { id } = req.params;
			if (![ReactionType.Like, ReactionType.Love].includes(reaction)) {
				return res.status(403).send({ message: "Unknown reaction, 1 for like 2 for love", success: false });
			}
			const post = await Post.findOrFailByPk(id, res);
			if (post) {
				const where = { id, userId: req.body.decoded.id };
				const newReaction = {
					userId: req.body.decoded.id,
					postId: post.id,
					type: reaction
				}
				const data = Post.updateOrCreate(Reaction, where, newReaction)
				return res.status(201).send({ data, message: "Reaction recorded successfully", success: true });
			}
			return;
		} catch (err: any) {
			return res.status(500).send({
				message: err.message,
				success: false,
			});
		}
	}

	public async unReact(req: Request, res: Response) {
		try {
			const { id } = req.params;
			const reaction = await Reaction.findOne({ where: { id, userId: req.body.decoded.id } });
			if (reaction) {
				await reaction.destroy();
				return res.status(201).send({ message: "Reaction removed", success: true });
			}
			return res.status(404).send({
				message: 'Reaction not found',
				success: false,
			});
		} catch (err: any) {
			return res.status(500).send({
				message: err.message,
				success: false,
			});
		}
	}

	public static async findOrFailByPk(pk: any, res: Response): Promise<Model | undefined> {
		const model = await Model.findByPk(pk);
		if (model) {
			return model;
		}
		res.status(404).send({
			message: 'Post not found',
			success: false,
		});
		return;
	}

	public static transform(posts: { rows: Model[]; count: number }) {
		let results: Model[] = []
		posts.rows.forEach((post) => {
			post = post.get({ plain: true })
			post.likes = 0;
			post.loves = 0;
			post.reactions.map(react => {
				switch (react.type) {
					case ReactionType.Like:
						post.likes++;
						break;
					case ReactionType.Love:
						post.loves++;
						break;
				}
			})
			results.push(post)
		})
		return results;
	}
}

export default new Post();
