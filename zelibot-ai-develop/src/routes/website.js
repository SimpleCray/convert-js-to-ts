import { lazy, Suspense } from 'react';

import SplashScreen from '../components/loading-screen';

const HomePage = lazy(() => import('../pages/home'));
const FeaturesPage = lazy(() => import('../pages/features'));
const ProductPage = lazy(() => import('../pages/product'));
const PricingPage = lazy(() => import('../pages/pricing'));
const CompanyPage = lazy(() => import('../pages/company'));
const TermsPage = lazy(() => import('../pages/terms'));

export const websiteRoutes = [
	{
		path: '/',
		element: (
			<Suspense fallback={<SplashScreen />}>
				<HomePage />
			</Suspense>
		),
	},
	// {
	// 	path: 'features',
	// 	element: (
	// 		<Suspense fallback={<SplashScreen />}>
	// 			<FeaturesPage />
	// 		</Suspense>
	// 	),
	// },
	{
		path: 'product',
		element: (
			<Suspense fallback={<SplashScreen />}>
				<ProductPage />
			</Suspense>
		),
	},
	{
		path: 'pricing',
		element: (
			<Suspense fallback={<SplashScreen />}>
				<PricingPage />
			</Suspense>
		)
	},
	{
		path: 'company',
		element: (
			<Suspense fallback={<SplashScreen />}>
				<CompanyPage />
			</Suspense>
		)
	},
	{
		path: 'terms',
		element: (
			<Suspense fallback={<SplashScreen />}>
				<TermsPage />
			</Suspense>
		),
	}
];
