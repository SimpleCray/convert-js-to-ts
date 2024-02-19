import { createSlice } from '@reduxjs/toolkit';

const initialState = {
	data: {},
};

const slice = createSlice({
	name: 'aiworker',
	initialState,
	reducers: {
		passConversationToAIWorker(state, action) {
			state.data.conversation_guid = action?.payload?.conversation_guid;
		},
		clearAiWorkerData(state) {
			state.data = {};
		}
	},
});

// Reducer
export default slice.reducer;

// Actions
export const { passConversationToAIWorker, clearAiWorkerData } = slice.actions;
