import { lazy, Suspense } from 'react';

import { LoadingScreen } from '../components/loading-screen';
import { Navigate, Outlet } from 'react-router-dom';
import SelectHelperForVideo from '../feature/auth/SelectHelper/SelectHelperForVideo';

// Overview
const OverviewPage = lazy(() => import('../pages/dashboard/overview'));

// Billing
const BillingPage = lazy(() => import('../pages/dashboard/billing/overview'));
const BillingUpgradePage = lazy(() => import('../pages/dashboard/billing/upgrade'));

// Invoices
const InvoicesPage = lazy(() => import('../pages/dashboard/billing/invoices/invoice-list'));
const InvoiceDetailsPage = lazy(() => import('../pages/dashboard/billing/invoices/details'));

// HR Helper
const HrHelperPage = lazy(() => import('../pages/dashboard/hr-helper/workspace'));
const HrCandidatePage = lazy(() => import('../pages/dashboard/hr-helper/candidates'));
const HrHistoryPage = lazy(() => import('../pages/dashboard/hr-helper/history'));
const HrJobAdsPage = lazy(() => import('../pages/dashboard/hr-helper/job-ads'));
const HrJobProfilesPage = lazy(() => import('../pages/dashboard/hr-helper/job-profiles'));
const HrOpenJobsPage = lazy(() => import('../pages/dashboard/hr-helper/open-jobs'));
const HrPhoneCandidatePage = lazy(() => import('../pages/dashboard/hr-helper/phone-candidate'));
const HrSendEmailPage = lazy(() => import('../pages/dashboard/hr-helper/send-email'));
const HrSendSmsPage = lazy(() => import('../pages/dashboard/hr-helper/send-sms'));
const HrUploadDocumentsPage = lazy(() => import('../pages/dashboard/hr-helper/upload-documents'));
const HrVideoMessagingPage = lazy(() => import('../pages/dashboard/hr-helper/video-messaging'));

// User
const UserAccountPage = lazy(() => import('../pages/dashboard/user/account'));
const UserChangePasswordPage = lazy(() => import('../feature/dashboard/user/UserChangePassword'));
const UserNotificationsPage = lazy(() => import('../pages/dashboard/user/notifications'));
const UserSocialLinksPage = lazy(() => import('../pages/dashboard/user/social-links'));
const UserChangeAssistantPage = lazy(() => import('../pages/dashboard/user/change-assistant'));

// Internal Affairs
const EditActionsPage = lazy(() => import('../pages/dashboard/internal-affairs/edit-actions'));

export const dashboardRoutes = [
	{
		path: 'dashboard',
		element: (
			<Suspense fallback={<LoadingScreen />}>
				<Outlet />
			</Suspense>
		),
		children: [
			{
				path: '',
				element: <Navigate to='/dashboard/hr-helper/workspace' replace />,
			},
			{
				path: 'overview',
				element: <OverviewPage />,
			},
			// Billing
			{
				path: 'billing',
				element: (
					<Suspense fallback={<LoadingScreen />}>
						<Outlet />
					</Suspense>
				),
				children: [
					{
						path: '',
						element: <Navigate to='/dashboard/billing/overview' replace />,
					},
					{
						path: 'overview',
						element: <BillingPage />,
					},
					{
						path: 'upgrade',
						element: <BillingUpgradePage />,
					},
					{
						path: 'invoices',
						element: (
							<Suspense fallback={<LoadingScreen />}>
								<InvoicesPage />
							</Suspense>
						),
						children: [
							{
								path: ':id',
								element: (
									<Suspense fallback={<LoadingScreen />}>
										<InvoiceDetailsPage />
									</Suspense>
								),
							},
						],
					},
				],
			},
			// Choose Helper
			{
				path: 'choose-helper',
				element: (
					<Suspense fallback={<LoadingScreen />}>
						<SelectHelperForVideo />
					</Suspense>
				),
			},
			// HR Helper
			{
				path: 'hr-helper',
				element: (
					<Suspense fallback={<LoadingScreen />}>
						<Outlet />
					</Suspense>
				),
				children: [
					{
						path: '',
						element: <Navigate to='/dashboard/hr-helper/workspace' replace />,
					},
					{
						path: 'workspace',
						element: (
							<Suspense fallback={<LoadingScreen />}>
								<HrHelperPage />
							</Suspense>
						),
					},
					{
						path: 'candidates',
						element: (
							<Suspense fallback={<LoadingScreen />}>
								<HrCandidatePage />
							</Suspense>
						),
					},
					{
						path: 'history',
						element: (
							<Suspense fallback={<LoadingScreen />}>
								<HrHistoryPage />
							</Suspense>
						),
					},
					{
						path: 'job-ads',
						element: (
							<Suspense fallback={<LoadingScreen />}>
								<HrJobAdsPage />
							</Suspense>
						),
					},
					{
						path: 'job-profiles',
						element: (
							<Suspense fallback={<LoadingScreen />}>
								<HrJobProfilesPage />
							</Suspense>
						),
					},
					{
						path: 'open-jobs',
						element: (
							<Suspense fallback={<LoadingScreen />}>
								<HrOpenJobsPage />
							</Suspense>
						),
					},
					{
						path: 'phone-candidate',
						element: (
							<Suspense fallback={<LoadingScreen />}>
								<HrPhoneCandidatePage />
							</Suspense>
						),
					},
					{
						path: 'send-email',
						element: (
							<Suspense fallback={<LoadingScreen />}>
								<HrSendEmailPage />
							</Suspense>
						),
					},
					{
						path: 'send-sms',
						element: (
							<Suspense fallback={<LoadingScreen />}>
								<HrSendSmsPage />
							</Suspense>
						),
					},
					{
						path: 'upload-documents',
						element: (
							<Suspense fallback={<LoadingScreen />}>
								<HrUploadDocumentsPage />
							</Suspense>
						),
					},
					{
						path: 'video-messaging',
						element: (
							<Suspense fallback={<LoadingScreen />}>
								<HrVideoMessagingPage />
							</Suspense>
						),
					},
				],
			},
			// User
			{
				path: 'user',
				element: (
					<Suspense fallback={<LoadingScreen />}>
						<Outlet />
					</Suspense>
				),
				children: [
					{
						path: '',
						element: <Navigate to='/dashboard/user/account' replace />,
					},
					{
						path: 'account',
						element: <UserAccountPage />,
					},
					{
						path: 'change-password',
						element: <UserChangePasswordPage />,
					},
					{
						path: 'notifications',
						element: <UserNotificationsPage />,
					},
					{
						path: 'social-links',
						element: <UserSocialLinksPage />,
					},
					{
						path: 'assistant',
						element: <UserChangeAssistantPage />,
					},
				],
			},
			// Internal Affairs
			{
				path: 'internal-affairs',
				element: (
					<Suspense fallback={<LoadingScreen />}>
						<Outlet />
					</Suspense>
				),
				children: [
					{
						path: '',
						element: <Navigate to='/dashboard/internal-affairs/edit-actions' replace />,
					},
					{
						path: 'edit-actions',
						element: (
							<Suspense fallback={<LoadingScreen />}>
								<EditActionsPage />
							</Suspense>
						),
					},
				],
			},
		],
	},
];
