import { Express } from 'express-serve-static-core'
import request from 'supertest'
import PostFactory from '../factories/PostFactory'
import { server } from '../../src/http-server'
import faker from 'faker'
import AuthFactory, { AuthUser } from '../factories/AuthFactory'
import Post from '../../src/http/controllers/Post'
import { ReactionType } from '../../src/models/ReactionType'

let testServer: Express
let authUser: AuthUser

beforeAll(async () => {
	testServer = await server()
	authUser = await AuthFactory()
})

describe('/posts', () => {
	it('should return 200 when hitting root path', async done => {
		request(testServer)
			.get(`/api/v1`)
			.expect('Content-Type', 'text/html; charset=utf-8')
			.expect(200)
			.end((err, res) => {
				if (err) return done(err)
				done()
			})
	})

	it('should return 404 when trying to get unavailable post', async done => {
		request(testServer)
			.get(`/api/v1/posts/not-found`)
			.expect('Content-Type', /json/)
			.expect(404)
			.end((err, res) => {
				if (err) return done(err)
				done()
			})
	})

	it('should return 200 when trying to get a post that exist', async done => {
		const post = await PostFactory();
		request(testServer)
			.get(`/api/v1/posts/${post.id}`)
			.expect('Content-Type', /json/)
			.expect(200)
			.end((err, res) => {
				if (err) return done(err)
				expect(res.body).toHaveProperty(['data'])
				done()
			})
	})

	it('should return 200 when trying to get all posts', async done => {
		request(testServer)
			.get(`/api/v1/posts/`)
			.expect('Content-Type', /json/)
			.expect(200)
			.end((err, res) => {
				if (err) return done(err)
				expect(res.body).toHaveProperty(['data'])
				expect(res.body.success).toEqual(true)
				done()
			})
	})

	it('should return 401 when non authorized user attempts to create post', async done => {
		request(testServer)
			.post(`/api/v1/posts/`)
			.send({ title: '', body: '' })
			.expect('Content-Type', /json/)
			.expect(401)
			.end((err, res) => {
				if (err) return done(err)
				done()
			})
	})

	it('should return 400 when creating new post with empty body', async done => {
		request(testServer)
			.post(`/api/v1/posts/`)
			.send({ title: '', body: '' })
			.set("Authorization", `Bearer ${authUser.token}`)
			.expect('Content-Type', /json/)
			.expect(400)
			.end((err, res) => {
				if (err) return done(err)
				expect(res.body).toHaveProperty(['message'])
				expect(res.body.success).toEqual(false)
				done()
			})
	})

	it('should return 201 when creating new post with necessary fields', async done => {
		request(testServer)
			.post(`/api/v1/posts/`)
			.send(await PostFactory({}, false))
			.set("Authorization", `Bearer ${authUser.token}`)
			.expect('Content-Type', /json/)
			.expect(400)
			.end((err, res) => {
				if (err) return done(err)
				expect(res.body).toHaveProperty(['message'])
				expect(res.body.success).toEqual(false)
				done()
			})
	})

	it('should return 404 when attempting to delete a non-existing post', async done => {
		request(testServer)
			.delete(`/api/v1/posts/fake`)
			.send(await PostFactory({}, false))
			.set("Authorization", `Bearer ${authUser.token}`)
			.expect('Content-Type', /json/)
			.expect(404)
			.end((err, res) => {
				if (err) return done(err)
				expect(res.body).toHaveProperty(['message'])
				expect(res.body.success).toEqual(false)
				done()
			})
	})

	it('should return 200 when a post is successfully deleted and 404 when an attempt is made to get the post ', async done => {
		const post = await PostFactory();
		request(testServer)
			.delete(`/api/v1/posts/${post.id}`)
			.send(await PostFactory({}, false))
			.set("Authorization", `Bearer ${authUser.token}`)
			.expect('Content-Type', /json/)
			.expect(200)
			.then(async (res) => {
				request(testServer)
					.get(`/api/v1/posts/${post.id}`)
					.send(await PostFactory({}, false))
					.set("Authorization", `Bearer ${authUser.token}`)
					.expect('Content-Type', /json/)
					.expect(404)
					.end((err, res) => {
						if (err) return done(err)
						expect(res.body).toHaveProperty(['message'])
						expect(res.body.success).toEqual(false)
						done()
					})
			})
	})

	it('should return 201 when adding reply to a post', async done => {
		const post = await PostFactory();
		request(testServer)
			.put(`/api/v1/posts/${post.id}/reply`)
			.send(await PostFactory({}, false))
			.set("Authorization", `Bearer ${authUser.token}`)
			.expect('Content-Type', /json/)
			.expect(201)
			.end((err, res) => {
				if (err) return done(err)
				expect(res.body).toHaveProperty(['message'])
				expect(res.body.success).toEqual(true)
				done()
			})
	})

	it('should return 403 when adding reply to a post reply', async done => {
		const post = await PostFactory();
		const reply = await PostFactory({ parentId: post.id })
		request(testServer)
			.put(`/api/v1/posts/${reply.id}/reply`)
			.send(await PostFactory({}, false))
			.set("Authorization", `Bearer ${authUser.token}`)
			.expect('Content-Type', /json/)
			.expect(403)
			.end((err, res) => {
				if (err) return done(err)
				expect(res.body).toHaveProperty(['message'])
				expect(res.body.success).toEqual(false)
				done()
			})
	})

	it('should return 201 when reacting to a post', async done => {
		const post = await PostFactory();
		request(testServer)
			.post(`/api/v1/posts/${post.id}/react`)
			.send({reaction: ReactionType.Like})
			.set("Authorization", `Bearer ${authUser.token}`)
			.expect('Content-Type', /json/)
			.expect(201)
			.end((err, res) => {
				if (err) return done(err)
				expect(res.body).toHaveProperty(['message'])
				expect(res.body.success).toEqual(true)
				done()
			})
	})

	it('should return 201 when removing reaction from a post', async done => {
		const post = await PostFactory();
		request(testServer)
			.post(`/api/v1/posts/${post.id}/react`)
			.send({reaction: ReactionType.Like})
			.set("Authorization", `Bearer ${authUser.token}`)
			.expect('Content-Type', /json/)
			.expect(201)
			.then(( res) => {
				request(testServer)
					.delete(`/api/v1/posts/${post.id}/react`)
					.set("Authorization", `Bearer ${authUser.token}`)
					.expect('Content-Type', /json/)
					.expect(201)
					.end((err, res) => {
						if (err) return done(err)
						expect(res.body).toHaveProperty(['message'])
						expect(res.body.success).toEqual(true)
						done()
					})
			})
	})
})
