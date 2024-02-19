import { combineReducers } from 'redux';
import { persistReducer } from 'redux-persist';
import createWebStorage from 'redux-persist/lib/storage/createWebStorage';
// slices
import whisperReducer from './slices/whisper';
import authReducer from './slices/auth';
import modalReducer from './slices/modal';
import notificationReducer from './slices/notification';
import userSessionReducer from './slices/userSession';
import refreshReducer from './slices/refresh';
import aiworkerReducer from './slices/aiworkerSlice';

// ----------------------------------------------------------------------
// All rights reserved - SEDZ PTY LTD - 2023
// ----------------------------------------------------------------------

export const createNoopStorage = () => ({
	getItem() {
		return Promise.resolve(null);
	},
	setItem(_key, value) {
		return Promise.resolve(value);
	},
	removeItem() {
		return Promise.resolve();
	},
});

export const storage = typeof window !== 'undefined' ? createWebStorage('local') : createNoopStorage();

export const rootPersistConfig = {
	key: 'root',
	storage,
	keyPrefix: 'redux-',
	whitelist: [],
};

export const authPersistConfig = {
	key: 'auth',
	storage,
	keyPrefix: 'redux-',
	whitelist: [],
};

export const whisperPersistConfig = {
	key: 'whisper',
	storage,
	keyPrefix: 'redux-',
	whitelist: ['sortBy', 'checkout'],
};

export const notificationPersistConfig = {
	key: 'notification',
	storage,
	keyPrefix: 'redux-',
	whitelist: [],
};

export const userSessionPersistConfig = {
	key: 'userSession',
	storage,
	keyPrefix: 'redux-',
	whitelist: [],
};

export const modalConfig = {
	key: 'modal',
	storage,
	keyPrefix: 'redux-',
	whitelist: [],
}

export const refreshConfig = {
	key: 'refresh',
	storage,
	keyPrefix: 'redux-',
	whitelist: [],
}

export const aiworkerConfig = {
	key: 'aiworker',
	storage,
	keyPrefix: 'redux-',
	whitelist: [],
}

const rootReducer = combineReducers({
	whisper: persistReducer(whisperPersistConfig, whisperReducer),
	auth: persistReducer(authPersistConfig, authReducer),
	notification: persistReducer(notificationPersistConfig, notificationReducer),
	userSession: persistReducer(userSessionPersistConfig, userSessionReducer),
	modal: persistReducer(modalConfig, modalReducer),
	refresh: persistReducer(refreshConfig, refreshReducer),
	aiworker: persistReducer(aiworkerConfig, aiworkerReducer),
});

export default rootReducer;
