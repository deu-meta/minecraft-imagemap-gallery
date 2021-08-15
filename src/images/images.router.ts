import { Request, Response, Router } from 'express';
import path from 'path';
import fs from 'fs';
import multer from 'multer';
import { nanoid } from 'nanoid';
import { IMAGE_DIRECTORY } from '../env';
import { images, registerImageName, reloadImages } from './images.interface';

const upload = multer({
	dest: IMAGE_DIRECTORY,
	storage: multer.diskStorage({
		destination: (req, file, cb) => {
			cb(null, IMAGE_DIRECTORY);
		},
		filename: (req, file, cb) => {
			const filename = nanoid() + path.extname(file.originalname);
			cb(null, filename);

			registerImageName(filename, file.originalname);
		},
	}),
	limits: {
		fileSize: 5 * 1_048_576, // 5 MB,
		files: 1,
	},
});

export const imagesRouter = Router();

reloadImages();

fs.watch(IMAGE_DIRECTORY, () => {
	console.log('something change happened on image directory. rebuild image list ...');
	reloadImages();
});

imagesRouter.get('/', async (req: Request, res: Response) => {
	res.status(200).send(Object.values(images));
});

imagesRouter.post('/upload', upload.single('image'), async (req: Request, res: Response) => {
	return res.redirect('/');
});
