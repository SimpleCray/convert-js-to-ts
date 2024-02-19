import PropTypes from 'prop-types';
import { useCallback, useEffect } from 'react';
// routes
import { PATH_DASHBOARD } from '../../../routes/paths';
//
import { useAuthContext } from './useAuthContext';
import { useRouter } from 'src/hooks/useRouter';

// ----------------------------------------------------------------------
// All rights reserved - SEDZ PTY LTD - 2023
// ----------------------------------------------------------------------

GuestGuard.propTypes = {
	children: PropTypes.node,
};

export default function GuestGuard({ children }) {
	const router = useRouter();

	const { isAuthenticated } = useAuthContext();

	const returnTo = PATH_DASHBOARD.hrHelper.root;

	const check = useCallback(() => {
		if (isAuthenticated) {
			router.replace(returnTo);
		}
	}, [isAuthenticated, returnTo, router]);

	useEffect(() => {
		check();
	}, [check]);

	return <> {children} </>;
}
