require('dotenv').config()
const isProduction = process.env.ENVIRONMENT?.toLowerCase() === "production"

export const config = {
	'rootUpload': process.env.ROOT_UPLOAD ?? "uploads",
	'env': process.env.ENVIRONMENT ?? "develop",
  'username': process.env.MYSQL_USERNAME ?? "",
  'password': process.env.MYSQL_PASSWORD ?? "",
  'database': process.env.MYSQL_DB ?? "",
  'host': process.env.MYSQL_HOST ?? "",
  'dialect': 'mysql',
  'aws_region': process.env.AWS_REGION,
  'aws_profile': process.env.AWS_PROFILE,
  'aws_media_bucket': process.env.AWS_BUCKET,
  'url': process.env.URL,
  'jwt': {
    'secret': process.env.JWT_SECRET ?? "",
	},
	'mail_username': process.env.MAIL_USERNAME ?? "",
	'mail_password': process.env.MAIL_PASSWORD ?? "",
	'mail_host': process.env.MAIL_HOST ?? "",
	'mail_port': process.env.MAIL_PORT ?? "",
	'mail_from': process.env.MAIL_FROM ?? "",
	isProduction
};
