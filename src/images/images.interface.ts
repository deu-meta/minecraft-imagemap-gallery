import fs from 'fs';
import util from 'util';
import * as ExifReader from 'exifreader';
import { Image } from './image.interface';
import path from 'path';
import { IMAGE_DIRECTORY } from '../env';

const readdir = util.promisify(fs.readdir);
const readFile = util.promisify(fs.readFile);
const writeFile = util.promisify(fs.writeFile);
const stat = util.promisify(fs.stat);

export interface Images {
	[key: string]: Image;
}

export let images: Images = {};

let imageNameResolver: Record<string, string> = {};

export async function reloadImages() {
	try {
		images = {};
		try {
			imageNameResolver = JSON.parse(await readFile('./image-name-resolver.json', 'utf-8'));
		} catch (e) {}

		const filenames = await (
			await readdir(IMAGE_DIRECTORY)
		).map(filename => ({
			filename,
			fullname: path.join(IMAGE_DIRECTORY, filename),
		}));

		await Promise.all(
			filenames.map(async ({ filename, fullname }) => {
				try {
					const tags = await ExifReader.load(await readFile(fullname));
					const stats = await stat(fullname);

					images[filename] = {
						name: imageNameResolver[filename] ?? filename,
						filename,
						width: parseInt(tags['Image Width']?.value),
						height: parseInt(tags['Image Height']?.value),
						mtime: stats.mtime.toString(),
					};
				} catch (error) {
					// ignore error. may not a image file
				}
			}),
		);
	} catch (error) {
		console.log('Reload images failed. error: ', error);
	}
}

export async function registerImageName(id: string, name: string) {
	imageNameResolver[id] = name;

	writeFile('./image-name-resolver.json', JSON.stringify(imageNameResolver));
}
