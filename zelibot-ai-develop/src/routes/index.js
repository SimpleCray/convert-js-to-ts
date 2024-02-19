import { Navigate, useRoutes } from 'react-router-dom';
import { websiteRoutes } from './website';
import { authRoutes } from './auth';
import { dashboardRoutes } from './dashboard';
import { lazy, Suspense } from 'react';
import SplashScreen from '../components/loading-screen';
import SelectHelperForVideo from '../feature/auth/SelectHelper/SelectHelperForVideo';
import { ChooseHelper } from '../feature/onboarding/components';

const Page404 = lazy(() => import('../pages/404'));

export default function Router() {
	return useRoutes([
		// Website routes
		...websiteRoutes,

		// Auth routes
		...authRoutes,

		// Dashboard routes
		...dashboardRoutes,
		{
			path: '404',
			element: (
				<Suspense fallback={<SplashScreen />}>
					<Page404 />
				</Suspense>
			),
		},
		// No match 404
		{ path: '*', element: <Navigate to='/404' replace /> },
	]);
}
