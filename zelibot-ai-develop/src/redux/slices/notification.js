import { createSlice, createSelector } from '@reduxjs/toolkit';
import { getNotificationsFromServer } from '../../constants';

// ----------------------------------------------------------------------
// All rights reserved - SEDZ PTY LTD - 2023
// ----------------------------------------------------------------------

const initialState = {
	isLoading: false,
	error: null,
	notifications: [],
};

const slice = createSlice({
	name: 'notification',
	initialState,
	reducers: {
		// START LOADING
		startLoading(state) {
			state.isLoading = true;
		},

		// HAS ERROR
		hasError(state, action) {
			state.isLoading = false;
			state.error = action.payload;
		},

		// GET NOTIFICATIONS
		getNotificationSuccess(state, action) {
			state.isLoading = false;
			state.notifications = action.payload;
		},

		// CREATE NOTIFICATION
		createNotification(state, action) {
			const newNotification = action.payload;
			state.isLoading = false;
			state.notifications = [newNotification, ...state.notifications];
		},

		// UPDATE NOTIFICATION
		updateNotification(state, action) {
			state.isLoading = false;
			state.notifications = state.notifications.map((notification) => {
				if (notification.messageId === action.payload.messageId) {
					return action.payload;
				}
				return notification;
			});
		},

		// CLEAR NOTIFICATIONS
		clearNotifications(state, action) {
			state.isLoading = false;
			state.notifications = [];
		},
	},
});

// Reducer
export default slice.reducer;

// Actions
export const { startLoading, hasError, createNotification, updateNotification, clearNotifications } = slice.actions;

// Selectors
export const notificationsSelector = createSelector(
	(state) => state.notification,
	(notificationState) => notificationState.notifications
);
export const unreadNotficationsSelector = createSelector(
	(state) => state.notification,
	(notificationState) => notificationState.notifications.filter((notification) => notification.status === 'UNREAD')
);

export function getNotifications() {
	return async (dispatch) => {
		dispatch(slice.actions.startLoading());
		try {
			const response = await getNotificationsFromServer();
			dispatch(slice.actions.getNotificationSuccess(response));
		} catch (error) {
			dispatch(slice.actions.hasError(error));
		}
	};
}
