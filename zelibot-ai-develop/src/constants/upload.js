import { AWS_S3, AWS_API } from '../config-global';
import { v4 as uuidv4 } from 'uuid';
import { GetObjectCommand } from '@aws-sdk/client-s3';
import { Upload } from '@aws-sdk/lib-storage';

export const uploadImageToS3 = (file, url) => {
	return new Promise(async (resolve, reject) => {
		try {
			const uUID = uuidv4();
			const fileName = file.name;
			const fileExtension = fileName.split('.').pop();
			const bucketUrl = url ? url : `images/products/${getCurrentDateTime()}`;
			const key = `${bucketUrl}/${uUID}.${fileExtension}`;
			const parallelUploads3 = new Upload({
				client: AWS_S3,
				params: {
					Bucket: AWS_API.s3UploadBucket,
					Key: key,
					Body: file,
					Tagging: `FileName=${fileName}`,
				},
			});
			const response = await parallelUploads3.done();
			resolve(response);
		} catch (error) {
			console.error('error: ', error);
			reject(error);
		}
	});
};

const getCurrentDateTime = () => {
	const date = new Date();
	const year = date.getUTCFullYear();
	const month = date.getUTCMonth() + 1;
	const day = date.getUTCDate();
	const hour = date.getUTCHours();

	return `${year}/${month}/${day}/${hour}`;
};

export const getImageFromS3 = (imageKey = '') => {
	imageKey = imageKey.replace(`https://s3.${AWS_API.region}.amazonaws.com/${AWS_API.s3UploadBucket}/`, '');
	imageKey = imageKey.replace(`https://${AWS_API.s3UploadBucket}.s3.${AWS_API.region}.amazonaws.com/`, '');
	const fileExtension = imageKey.split('.').pop() || 'png';

	if (imageKey.includes(`base64`) || imageKey.length === 0) {
		return new Promise(async (resolve, reject) => {
			resolve(imageKey);
		});
	}

	return new Promise(async (resolve, reject) => {
		try {
			const command = new GetObjectCommand({
				Bucket: AWS_API.s3UploadBucket,
				Key: imageKey,
			});
			const response = await AWS_S3.send(command);
			const data = await response.Body.transformToString('base64');
			const base64Image = `data:image/${fileExtension};base64,${data}`;
			resolve(base64Image);
		} catch (error) {
			console.error('error: ', error);
			reject(error);
		}
	});
};

export const fileDropzoneProps = {
	accept: {
		'image/png': ['.png'],
		'image/jpeg': ['.jpeg', '.jpg'],
		'image/gif': ['.gif'],
	},
	maxSize: 5242880,
};
