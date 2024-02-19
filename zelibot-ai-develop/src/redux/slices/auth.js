import { createSlice } from '@reduxjs/toolkit';

// ----------------------------------------------------------------------
// All rights reserved - SEDZ PTY LTD - 2023
// ----------------------------------------------------------------------
const initialState = {
	isAuthenticated: false,
	isInitialized: false,
	userState: {
		email: '',
		firsName: '',
		lastName: '',
		password: '',
		accessToken: 'INVALID',
	},
};

const slice = createSlice({
	name: 'auth',
	initialState,
	reducers: {
		// Add User to state [Denver Naidoo - 24 Feb 2023] --------------------------------------------
		addUser(state, action) {
			const newUser = action.payload;
			state.userState = newUser;
		},
	},
});

// Reducer
export default slice.reducer;

// Actions
export const { addUser } = slice.actions;
