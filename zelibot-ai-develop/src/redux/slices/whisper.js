import { createSlice } from '@reduxjs/toolkit';

// ----------------------------------------------------------------------
// All rights reserved - SEDZ PTY LTD - 2023
// ----------------------------------------------------------------------

const initialState = {
	isLoading: false,
	error: null,
	userMessage: {
		userMessageTitle: null,
		userMessage: null,
		userMessageEvent: null,
		severity: null,
	},
};

const slice = createSlice({
	name: 'whisper',
	initialState,
	reducers: {
		startLoading(state) {
			state.isLoading = true;
		},

		hasError(state, action) {
			state.isLoading = false;
			state.error = action.payload;
		},

		setUserMessage(state, action) {
			state.isLoading = false;
			state.userMessage = action.payload;
		},

		resetUserMessage(state) {
			state.userMessage = null;
		},
	},
});

// Reducer
export default slice.reducer;

// Actions
export const { setUserMessage, resetUserMessage, startLoading, hasError } = slice.actions;
