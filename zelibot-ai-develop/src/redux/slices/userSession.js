import { createSlice } from '@reduxjs/toolkit';

// ----------------------------------------------------------------------
// All rights reserved - SEDZ PTY LTD - 2023
// ----------------------------------------------------------------------

const initialState = {
	isLoading: false,
	error: 'NO ERROR',
	userSession: {
		sessionId: null,
		userName: null,
		connectionId: null,
		knowItAllStream: '',
	},
};

const slice = createSlice({
	name: 'userSession',
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

		// GET USER SESSION
		getUserSessionSuccess(state, action) {
			state.isLoading = false;
			state.userSession = action.payload;
		},

		// UPDATE USER SESSION
		updateUserSession(state, action) {
			const newUserSession = action.payload;
			state.isLoading = false;
			state.userSession = {
				...state.userSession,
				...newUserSession,
			};
		},
	},
});

// Reducer
export default slice.reducer;

// Actions
export const { startLoading, hasError, updateUserSession } = slice.actions;
