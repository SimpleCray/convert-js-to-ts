import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';
import { SplashScreen } from '../../../components/loading-screen';
import Login from '../../../pages/auth/login';
import { useAuthContext } from './useAuthContext';
import { useRouter } from 'src/hooks/useRouter';

// ----------------------------------------------------------------------
// All rights reserved - SEDZ PTY LTD - 2023
// ----------------------------------------------------------------------

AuthGuard.propTypes = {
	children: PropTypes.node,
};

export default function AuthGuard({ children }) {
	const { isAuthenticated, isInitialized, requestedLocation, clearRedirect } = useAuthContext();
	const { pathname, push } = useRouter();
	// const [requestedLocationState, setRequestedLocation] = useState(requestedLocation);

	useEffect(() => {
		// console.log('Requested Location: ', requestedLocation, isAuthenticated, isInitialized, pathname)
		if (requestedLocation && pathname !== requestedLocation) {
			// console.log('Redirecting to ', requestedLocation)
			// let redirectUrl = requestedLocation + window.location.search;
			clearRedirect();
			push(requestedLocation + window.location.search);
		}
		// if (isAuthenticated) {
			// setRequestedLocation(null);
			// clearRedirect();
		// }
	}, [pathname, requestedLocation, isAuthenticated]);

	if (!isInitialized) {
		return <SplashScreen />;
	}

	if (!isAuthenticated) {
		return <Login />;
	}

	return <>{children}</>;
}
