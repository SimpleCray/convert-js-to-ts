import { USER_API } from '../config-global';
import axios from '../utils/axios';

export const updateProfileFields = (data) => {
	return new Promise(async (resolve, reject) => {
		await axios
			.post(USER_API, data)
			.then((response) => {
				resolve(response);
			})
			.catch((error) => {
				console.error('error: ', error);
				reject(error);
			});
	});
};

export const getUserProfile = () => {
	return new Promise(async (resolve, reject) => {
		await axios
			.get(USER_API)
			.then((response) => {
				resolve(response);
			})
			.catch((error) => {
				console.error('error: ', error);
				reject(error);
			});
	});
};

export const profileImageUrl = (user) => {
	// remove the @ symbol from the email address and the . symbol from the domain name
	user = user.replace('@', '-').replace('.', '-');
	return `users/profile/${user}`;
};
