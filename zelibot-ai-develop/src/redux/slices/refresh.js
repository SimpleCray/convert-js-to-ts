import { createSlice } from '@reduxjs/toolkit';

// ----------------------------------------------------------------------
// All rights reserved - SEDZ PTY LTD - 2023
// ----------------------------------------------------------------------
const initialState = {
	component: null,
	data: null
};

const slice = createSlice({
	name: 'refresh',
	initialState,
	reducers: {
		refreshComponent(state, action) {
			const component = action.payload.component;
			state.data = action?.payload?.data;
			state.component = component;
		},
        clearRefreshComponent(state) {
            state.component = null;
			state.data = null;
        }
	},
});

// Reducer
export default slice.reducer;

// Actions
export const { refreshComponent, clearRefreshComponent } = slice.actions;
