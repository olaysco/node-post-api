# POST API

## Description

This project impalements a RESTFUL Post API using Node.js (TypeScript), Express Framework and Sequelize ORM.

Available Endpoints are
-  /posts
	- `GET /`  returns all posts
	- `GET /:id` gets a single post`
	- `POST /` create a new post
	- `PATCH /:id` update a single post
	- `DELETE /:id` delete a single post
	- `PUT /:id/reply` reply to a post 
	- `POST /:id/react` react to a post
	- `DELETE /:id/react` delete reaction from a post
- /users
	- /auth
		- `POST /` register a new user
		- `POST /login` login a new user
		- `POST /password/reset` request password reset mail
		- `GET /verification` verify a user is logged in
		- `PATCH /password` update a user password


## Table of Content

- [Database Relationship](#database-relationship)
- [System Setup](#system-setup)
- [Documentation](#documentation)

### Database Relationship

![Database Image](https://github.com/olaysco/node-post-api/blob/develop/er.png?raw=true)

These are the database relationships:

1. A User can have multiple post.
2. A Post can have multiple replies(Same Post model).
4. A Post can have a reaction(like or love) from a user, this can also be easily extended to other types of reaction

### System Setup

System Requirement

- [Node](https://nodejs.org/en/download/)
- [Typescript](https://www.typescriptlang.org/download/)

#### Step 1: Clone the repository

```bash
git clone <repo-url>
cd <project-directory>
```

#### Step 2: Setup database

Create a new mysql database or set environment to develop, to use sqlite

#### Step 3: Setup environment variables

```bash 
cp .env.example .env
```
Setup your Database configuration and other necessary configuration

#### Step 4: Install NPM packages

```bash
npm i
```

#### Step 5: Start in development mode

```bash
npm run dev
```

#### Step 6: Run TestSuite

```bash
npm run test
```

### Documentation

Import the `PostApi.postman_collection.json` file to Postman to access the endpoints documentation,
- set `APP_URL` variable to the local API URL
-  click on example to see endpoint fields
