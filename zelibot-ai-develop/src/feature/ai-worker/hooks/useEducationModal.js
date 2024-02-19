import { useState, useEffect } from 'react';
import { AIGetAPIRequest, AIPostAPIRequest } from '../constants'
import { BASE_USER_API } from '../../../config-global';

export default function useEducationModal() {
	const [shouldShowEducationModal, setShouldShowEducationModal] = useState(false);
	const [educationModalHidden, setEducationModalHidden] = useState(false);

	useEffect(() => {
		fetchUserPreference();
	}, []);

	const fetchUserPreference = async () => {
		// Test the API Call
		const response = await AIGetAPIRequest(`${BASE_USER_API}/user-settings/`)
		// console.log('User Settings Data is >>> ', response);
		let remindMeLaterSession = window.sessionStorage.getItem(`education_remind_me_later`)
		if (response.education_show_again) {
			if (!remindMeLaterSession) {
				setShouldShowEducationModal(true);
				setEducationModalHidden(false);
			} else {
				setEducationModalHidden(true);
			}
		} else {
			setEducationModalHidden(true);
		}
		return
	}

	const hideEducationalModalForever = () => {
		// Test the API Call
		AIPostAPIRequest(`${BASE_USER_API}/user-settings/`, '{"education_show_again": "False"}')
		setShouldShowEducationModal(false);
		setEducationModalHidden(true);
		// localStorage.setItem(doNotShowEducationKey, true);
	};

	const hideEducationalModalForNow = () => {
		// AIPostAPIRequest(`${BASE_USER_API}/user-settings/`, '{"education_remind_later": "True"}')
		setShouldShowEducationModal(false);
		setEducationModalHidden(true);
		window.sessionStorage.setItem(`education_remind_me_later`, true)
	};

	const showEducationModal = () => {
		setShouldShowEducationModal(true);
	};

	return {
		shouldShowEducationModal,
		hideEducationalModalForNow,
		hideEducationalModalForever,
		showEducationModal,
		educationModalHidden,
		setEducationModalHidden,
	};
}
