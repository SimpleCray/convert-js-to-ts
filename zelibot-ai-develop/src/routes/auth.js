import { lazy, Suspense } from 'react';

import SplashScreen from '../components/loading-screen';
import { Navigate, Outlet } from 'react-router-dom';

const LoginPage = lazy(() => import('../pages/auth/login'));
const NewPasswordPage = lazy(() => import('../pages/auth/new-password'));
const OnboardingPage = lazy(() => import('../pages/auth/onboarding'));
const RegisterPage = lazy(() => import('../pages/auth/register'));
const ResetPasswordPage = lazy(() => import('../pages/auth/reset-password'));
const VerifyPage = lazy(() => import('../pages/auth/verify'));
const SpecialRegister = lazy(() => import('../pages/auth/register'));

export const authRoutes = [
	{
		path: 'auth',
		element: (
			<Suspense fallback={<SplashScreen />}>
				<Outlet />
			</Suspense>
		),
		children: [
			{
				path: '',
				element: <Navigate to='/auth/login' replace />,
			},
			{
				path: 'login',
				element: <LoginPage />,
			},
			{
				path: 'new-password',
				element: <NewPasswordPage />,
			},
			{
				path: 'onboarding',
				element: <OnboardingPage />,
			},
			{
				path: 'register',
				element: <RegisterPage/>,
			},
			{
				path: 'special-invite',
				element: <SpecialRegister title="Welcome!"/>,
			},
			{
				path: 'reset-password',
				element: <ResetPasswordPage />,
			},
			{
				path: 'verify',
				element: <VerifyPage />,
			},
		],
	},
];
