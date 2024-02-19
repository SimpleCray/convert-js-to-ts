import { useContext } from 'react';
//import { AuthContext } from './AwsCognitoContext';
import { AuthContext } from './AwsAmplifyContext';

// ----------------------------------------------------------------------
// All rights reserved - SEDZ PTY LTD - 2023
// ----------------------------------------------------------------------

export const useAuthContext = () => {
	const context = useContext(AuthContext);

	if (!context) throw new Error('useAuthContext context must be used inside AuthProvider');

	return context;
};
