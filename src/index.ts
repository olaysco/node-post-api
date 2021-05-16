import { server } from './http-server'

const port = process.env.PORT || 8000;

//start the http server
server().then((app) =>
	app.listen(port, () => {
		console.log(`server listening on port ${port}`);
		console.log(`press CTRL+C to stop server`);
	})
)
