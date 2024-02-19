import { VIDEO_CHAT } from '../config-global';
import axios from '../utils/axios';

export const getEndMeeting = (body) => {
	return new Promise(async (resolve, reject) => {
		await axios
			.post(`${VIDEO_CHAT}/end_meeting`, body)
			.then((response) => {
				resolve(response.data);
			})
			.catch((error) => {
				console.error('error: ', error);
				reject(error);
			});
	});
};

export const getAIQuestions = (body) => {
	return new Promise(async (resolve, reject) => {
		await axios
			.post(`${VIDEO_CHAT}/pre_screening_interview`, body)
			.then((response) => {
				resolve(response.data);
			})
			.catch((error) => {
				console.error('error: ', error);
				reject(error);
			});
	});
};

export const getMeetingWithAtendee = (inviteToken) => {
	return new Promise(async (resolve, reject) => {
		await axios
			.post(`${VIDEO_CHAT}/create_meeting_with_attendee`, { invite_token: inviteToken })
			.then((response) => {
				resolve(response.data);
			})
			.catch((error) => {
				console.error('error: ', error);
				reject(error);
			});
	});
};


export const sendTranscriptToEmail = (inviteToken) => {
	return new Promise(async (resolve, reject) => {
		await axios
			.post(`${VIDEO_CHAT}/send_transcript_to_candidate`, { invite_token: inviteToken })
			.then((response) => {
				resolve(response.data);
			})
			.catch((error) => {
				console.error('error: ', error);
				reject(error);
			});
	});
};

export const checkIfMeetingCanBeStarted = (token) => {
	return new Promise(async (resolve, reject) => {
		await axios
			.post(`${VIDEO_CHAT}/start_media_capture_pipeline`, { invite_token: token })
			.then((response) => {
				resolve(response.data);
			})
			.catch((error) => {
				console.error('error: ', error);
				reject(error);
			});
	});
};

