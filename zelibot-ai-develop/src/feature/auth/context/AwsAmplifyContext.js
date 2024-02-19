import PropTypes from 'prop-types';
import { createContext, useEffect, useReducer, useCallback, useMemo } from 'react';
import { Amplify, Auth } from 'aws-amplify';
// utils
import axios from '../../../utils/axios';
// config
import { COGNITO_API } from '../../../config-global';
//state management
import { getUserProfile, getUserBilling, logUserSession } from '../../../constants';
import { getImageFromS3 } from '../../../constants/upload';

// ----------------------------------------------------------------------
// All rights reserved - SEDZ PTY LTD - 2023
// ----------------------------------------------------------------------

const initialState = {
	isAuthenticated: false,
	isInitialized: false,
	requestedLocation: null,
	user: null,
};

const reducer = (localState, action) => {
	if (action.type === 'AUTH') {
		// console.log('Reducer Function >>> ', action.payload.requestedLocation);
		return {
			isInitialized: true,
			isAuthenticated: action.payload.isAuthenticated,
			requestedLocation: action.payload.requestedLocation ? action.payload.requestedLocation : null,
			user: action.payload.user,
		};
	}
	if (action.type === "CLEAR_REDIRECT") {
		// console.log('Clearing the requested location state in reducer')
		return {
			...localState,
			requestedLocation: null,
		};
	}
	if (action.type === 'LOGOUT') {
		return {
			...localState,
			isAuthenticated: false,
			requestedLocation: null,
			user: null,
		};
	}

	return localState;
};

// ----------------------------------------------------------------------
// All rights reserved - SEDZ PTY LTD - 2023
// ----------------------------------------------------------------------

export const AuthContext = createContext(null);

// ----------------------------------------------------------------------
// All rights reserved - SEDZ PTY LTD - 2023
// ----------------------------------------------------------------------

// set up the aws amplify
Amplify.configure({
	Auth: {
		identityPoolId: COGNITO_API.identityPoolId,
		region: COGNITO_API.region,
		userPoolId: COGNITO_API.userPoolId,
		userPoolWebClientId: COGNITO_API.clientId,
		mandatorySignIn: true,
	},
});

AuthProvider.propTypes = {
	children: PropTypes.node,
};

export function AuthProvider({ children }) {
	const [localState, localDispatch] = useReducer(reducer, initialState);

	const getUserAttributes = useCallback(
		() =>
			new Promise(async (resolve, reject) => {
				try {
					const currentUser = await Auth.currentAuthenticatedUser();
					const userAttributes = await Auth.userAttributes(currentUser);
					const userAttributesMap = userAttributes.reduce((acc, attr) => {
						acc[attr.Name] = attr.Value;
						return acc;
					}, {});
					resolve(userAttributesMap);
				} catch (error) {
					reject(error);
					// console.log(error);
				}
			}),
		[]
	);

	const getUserProfilePhoto = useCallback(
		() =>
			new Promise((resolve, reject) => {
				getUserProfile()
					.then((response) => {
						if (response.data[0]?.photoURL) {
							getImageFromS3(response.data[0].photoURL)
								.then((response) => {
									resolve(response);
								})
								.catch((error) => {
									reject(error);
								});
						} else {
							resolve(null);
						}
					})
					.catch((error) => {
						resolve(null);
					});
			}),
		[]
	);

	const getUserBillingPlan = useCallback(
		() =>
			new Promise((resolve, reject) => {
				getUserBilling()
					.then((response) => {
						if (response?.pricingModelTitle) {
							resolve(response.pricingModelTitle);
						} else {
							resolve(null);
						}
					})
					.catch((error) => {
						resolve(null);
					});
			}),
		[]
	);

	const getSession = useCallback(
		(redirect) =>
			new Promise(async (resolve, reject) => {
				const amplifyUser = await Auth.currentAuthenticatedUser()
					.then((user) => {
						return user;
					})
					.catch((error) => {
						return null;
					});
				if (amplifyUser) {
					await Auth.currentSession()
						.then(async (session) => {
							const attributes = await getUserAttributes();
							const token = session.getIdToken().getJwtToken();
							const userGroup = amplifyUser?.signInUserSession?.accessToken?.payload['cognito:groups'];
							axios.defaults.headers.common.Authorization = token;
							// await logUserSession(amplifyUser, token, attributes); #TODO: logging user session

							resolve({
								amplifyUser,
								session,
								headers: {
									Authorization: token,
								},
							});

							const profilePic = await getUserProfilePhoto();
							// const billingPlan = await getUserBillingPlan();
							// console.log('Redirect location in AwsAmplifyContext is >>> ', redirect)
							localDispatch({
								type: 'AUTH',
								payload: {
									isAuthenticated: true,
									requestedLocation: redirect ? redirect : null,
									user: {
										...amplifyUser,
										...attributes,
										photoURL: profilePic,
										// pricingModelTitle: billingPlan,
										displayName: attributes.name,
										role: userGroup,
									},
								},
							});
						})
						.catch((error) => {
							reject(error);
							console.error(error);
						});
				} else {
					localDispatch({
						type: 'AUTH',
						payload: {
							isAuthenticated: false,
							user: null,
						},
					});
				}
			}),
		[getUserAttributes, getUserProfilePhoto]
	);

	const initialize = useCallback(async () => {
		try {
			await getSession();
		} catch {
			localDispatch({
				type: 'AUTH',
				payload: {
					isAuthenticated: false,
					user: null,
				},
			});
		}
	}, [getSession]);

	useEffect(() => {
		initialize();
	}, [initialize]);

	// LOGIN
	const login = useCallback(
		(username, password, redirect) =>
			new Promise(async (resolve, reject) => {
				try {
					const user = await Auth.signIn(username, password);
					await getSession(redirect);
					resolve(user);
				} catch (error) {
					reject(error);
					// console.log(error);
				}
			}),
		[getSession]
	);

	//Clear Redirect URL
	const clearRedirect = useCallback(() => {
		// console.log('Calling clear redirect function')
		localDispatch({
			type: 'CLEAR_REDIRECT',
		});
	});

	// REGISTER
	const register = useCallback(
		(email, password, firstName) =>
			new Promise(async (resolve, reject) => {
				try {
					const user = await Auth.signUp({
						username: email,
						password,
						attributes: {
							name: firstName,
						},
					});
					resolve(user);
				} catch (error) {
					reject(error);
					// console.log(error);
				}
			}),
		[]
	);

	// VERIFY CODE
	const verifyCode = useCallback(
		(pin, email) =>
			new Promise(async (resolve, reject) => {
				try {
					const verify = await Auth.confirmSignUp(email, pin);
					resolve(verify);
				} catch (error) {
					reject(error);
					// console.log(error);
				}
			}),
		[]
	);

	// RESET PASSWORD
	const resetPassword = useCallback(
		(email) =>
			new Promise(async (resolve, reject) => {
				try {
					await Auth.forgotPassword(email);
					resolve();
				} catch (error) {
					reject(error);
					// console.log(error);
				}
			}),
		[]
	);

	// CONFIRM PASSWORD
	const newPassword = useCallback(
		(email, code, password) =>
			new Promise(async (resolve, reject) => {
				try {
					await Auth.forgotPasswordSubmit(email, code, password).then(async (response) => {
						await login(email, password);
						resolve(response);
					});
				} catch (error) {
					reject(error);
					// console.log(error);
				}
			}),
		[]
	);

	// LOGOUT
	const logout = useCallback(() => {
		window.sessionStorage.removeItem('education_remind_me_later');
		Auth.signOut();
		localStorage.clear();
		localDispatch({
			type: 'LOGOUT',
		});
	}, []);

	//CHANGE PASSWORD
	const changePassword = useCallback(
		(oldPassword, newPassword) =>
			new Promise(async (resolve, reject) => {
				try {
					const user = await Auth.currentAuthenticatedUser();
					if (!user) {
						reject('User not authenticated');
					}
					await Auth.changePassword(user, oldPassword, newPassword);
					resolve();
				} catch (error) {
					reject(error);
					// console.log(error);
				}
			}),
		[]
	);

	// UPDATE PROFILE
	const updateProfile = useCallback(
		(firstName) =>
			new Promise(async (resolve, reject) => {
				try {
					const user = await Auth.currentAuthenticatedUser();
					if (!user) {
						reject('User not authenticated');
					}
					await Auth.updateUserAttributes(user, {
						name: firstName,
					});
					resolve();
				} catch (error) {
					reject(error);
					// console.log(error);
				}
			}),
		[]
	);

	// RESEND CODE
	const resendCode = useCallback(
		(email) =>
			new Promise(async (resolve, reject) => {
				try {
					await Auth.resendSignUp(email);
					resolve();
				} catch (error) {
					reject(error);
					// console.log(error);
				}
			}),
		[]
	);

	const memoizedValue = useMemo(
		() => ({
			isInitialized: localState.isInitialized,
			isAuthenticated: localState.isAuthenticated,
			requestedLocation: localState.requestedLocation,
			user: localState.user,
			method: 'amplify',
			login,
			clearRedirect,
			register,
			verifyCode,
			resetPassword,
			newPassword,
			logout,
			changePassword,
			updateProfile,
			resendCode,
		}),
		[localState.isAuthenticated, localState.isInitialized, localState.requestedLocation, localState.user, login, clearRedirect, register, verifyCode, resetPassword, newPassword, logout, changePassword, updateProfile, resendCode]
	);
	return <AuthContext.Provider value={memoizedValue}>{children}</AuthContext.Provider>;
}
