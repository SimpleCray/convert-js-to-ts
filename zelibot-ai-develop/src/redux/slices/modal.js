import { createSlice } from '@reduxjs/toolkit';

// ----------------------------------------------------------------------
// All rights reserved - SEDZ PTY LTD - 2023
// ----------------------------------------------------------------------
const initialState = {
	modalComponent: null,
    visible: null,
	data: null
};

const slice = createSlice({
	name: 'modal',
	initialState,
	reducers: {
		// Add User to state [Denver Naidoo - 24 Feb 2023] --------------------------------------------
		openModal(state, action) {
			const modalComponent = action.payload.component;
			state.modalComponent = modalComponent;
			state.data = action?.payload?.data;
            state.visible = true;
		},
        closeModal(state, action) {
            state.modalComponent = null;
            state.visible = false;
			state.data = null;
        }
	},
});

// Reducer
export default slice.reducer;

// Actions
export const { openModal, closeModal } = slice.actions;
