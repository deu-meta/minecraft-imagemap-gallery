import { IMAGE_DIRECTORY, PORT } from './env';
import express, { Application, Request, Response } from 'express';
import * as dotenv from 'dotenv';
import helmet from 'helmet';
import { imagesRouter } from './images/images.router';

dotenv.config();

const app: Application = express();
// app.use(
// 	helmet({
// 		contentSecurityPolicy: false,
// 	}),
// );
app.use(express.urlencoded({ extended: false }));
app.use('/', express.static('public'));
app.use('/images', express.static(IMAGE_DIRECTORY));
app.use('/api/images', imagesRouter);

[
	['PORT', PORT],
	['IMAGE_DIRECTORY', IMAGE_DIRECTORY],
].forEach(([name, value]) => console.log(`${name}=${value}`));

const server = app.listen(PORT, () => {
	console.log(`Listening on port ${PORT}`);
});

// implement graceful stop
process.on('SIGTERM', () => {
	console.log('SIGTERM received. do shutdown');

	server.close(() => {
		console.log('server closed');

		process.exit(0);
	});
});
