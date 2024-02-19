import axios from '../utils/axios';
import { NOTIFICATION_API } from '../config-global';

export const getNotificationsFromServer = (notificationType = 'USER_NOTIFICATION') => {
	const url = NOTIFICATION_API + '?notification-type=' + notificationType;
	return new Promise(async (resolve, reject) => {
		await axios
			.get(url)
			.then((response) => {
				resolve(response.data);
			})
			.catch((error) => {
				console.error('error: ', error);
				reject(error);
			});
	});
};

export const markNotificationAsRead = (notificationPayload) => {
	const url = `${NOTIFICATION_API}`;
	return new Promise(async (resolve, reject) => {
		await axios
			.post(url, notificationPayload)
			.then((response) => {
				resolve(response.data);
			})
			.catch((error) => {
				console.error('error: ', error);
				reject(error);
			});
	});
};
