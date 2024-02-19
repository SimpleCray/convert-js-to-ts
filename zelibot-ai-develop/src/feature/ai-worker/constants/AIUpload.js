import { UPLOAD_API } from '../../../config-global';
import axios from '../../../utils/axios';

export const fileDropzoneProps = {
	accept: {
		'application/pdf': ['.pdf'],
		'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
		'text/plain': ['.txt'],
	},
	maxSize: 30000000, // 30MB
};

export const fileMimeTypeText = (type) => {
	switch (type) {
		case 'application/pdf':
			return 'pdf';
		case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
			return 'docx';
		case 'text/plain':
			return 'txt';
		default:
			return '';
	}
};

export const fileContentType = (extension) => {
	switch (extension) {
		case 'pdf':
			return 'application/pdf';
		case 'docx':
			return 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
		case 'txt':
			return 'text/plain';
		default:
			return 'application/octet-stream';
	}
};

const getCurrentDateTime = () => {
	const date = new Date();
	const year = date.getUTCFullYear();
	const month = date.getUTCMonth() + 1;
	const day = date.getUTCDate();
	const hour = date.getUTCHours();

	return `${year}/${month}/${day}/${hour}`;
};

export const uploadFileToS3 = (file) => {
	return new Promise((resolve, reject) => {
		const fileName = file.name.replace(/[^\p{L}\p{Z}\p{N}_.:/=+\-@]/gu, '_');
		const fileExtension = fileName.split('.').pop();
		const contentType = fileContentType(fileExtension);

		axios
			.get(`${UPLOAD_API}?file_name=${fileName}`)
			.then((response) => {
				// Code Starts [Laxman 21 SEP 2023]
				const presignedUrl = response.data.url;
				// Use the pre-signed URL to upload the file to S3
				fetch(presignedUrl, {
					method: 'PUT',
					body: file, // Replace with the actual File object
					headers: {
						'Content-Type': contentType, // Replace with the actual content type
					},
				})
					.then((uploadResponse) => {
						if (uploadResponse.ok) {
							resolve(response);
						} else {
							reject(uploadResponse);
						}
					})
					.catch((error) => {
						// console.log(error);
						reject(error);
					});
				// Code Ends  [Laxman 21 SEP 2023]
			})
			.catch((error) => {
				// console.log(error);
				reject(error);
			});
	});
};

// promise.all for multiple files
export const uploadFilesToS3 = (files) => {
	return new Promise((resolve, reject) => {
		let promises = [];
		files.forEach((file) => {
			promises.push(uploadFileToS3(file));
		});

		Promise.all(promises)
			.then((response) => {
				resolve(response);
			})
			.catch((error) => {
				// console.log(error);
				reject(error);
			});
	});
};
