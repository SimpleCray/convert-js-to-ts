// i18n
import './locales/i18n';

// scroll bar
import 'simplebar-react/dist/simplebar.min.css';

// lightbox
/* eslint-disable import/no-unresolved */
import 'yet-another-react-lightbox/styles.css';
import 'yet-another-react-lightbox/plugins/captions.css';
import 'yet-another-react-lightbox/plugins/thumbnails.css';

// map
import 'mapbox-gl/dist/mapbox-gl.css';

// editor
import 'react-quill/dist/quill.snow.css';

// lazy image
import 'react-lazy-load-image-component/src/effects/blur.css';

import { Provider as ReduxProvider } from 'react-redux';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { store } from './redux/store';
import { ThemeProvider, SettingsProvider, SnackbarProvider } from '@zelibot/zeligate-ui';
import { enqueueSnackbar } from 'notistack';
import ThemeLocalization from './locales';
import { StyledChart } from './components/chart';
import ProgressBar from './components/progress-bar';
import { MotionLazyContainer } from './components/animate';
import { AuthProvider } from './feature/auth/context/AwsAmplifyContext';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// For PostHog
import { useEffect } from 'react';
import posthog from 'posthog-js';
import { PostHogProvider } from 'posthog-js/react';
import { useScrollToTop } from './hooks/useScrollToTop';
import { useLocation } from 'react-router-dom';
import Router from './routes';
import { commonConstant } from './constants/common.constant';
// import { Amplify } from 'aws-amplify';

posthog.init(process.env['POSTHOG_PUBLIC_KEY'] ?? '', {
	api_host: process.env['POSTHOG_PUBLIC_HOST'],
	// Enable debug mode in development
	loaded: (postHog) => {
		if (process.env['NODE_ENV'] === 'development') {
			postHog.debug(false);
		}
	},
	capture_pageview: false, // Disable automatic pageview capture, as we capture manually
});

const showError = (error) => {
	let message = error?.response?.data?.message ?? error?.message ?? commonConstant.SOMETHING_WENT_WRONG;
	if (typeof message !== 'string') {
		message = commonConstant.SOMETHING_WENT_WRONG;
	}
	// Fallback Error catch if we don't define onError when using useQuery
	enqueueSnackbar(message, { variant: 'error' });
};

const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			retry: false,
			refetchOnWindowFocus: false,
			onError: showError,
			staleTime: commonConstant.STALE_TIME.MIN_1,
		},
		mutations: {
			retry: false,
			onError: showError,
		},
	},
});

export default function App() {
	// For PostHog
	const location = useLocation();
	useEffect(() => {
		posthog.capture('$pageview');
		// Amplify.configure({
		// 	Auth: {
		// 		userPoolId: 'ap-southeast-2_eqZyKArx7',
		// 		userPoolClientId: '4k5itutm22qn1ug5s50fvjkd4i',
		// 		identityPoolId: `ap-southeast-2:945a831f-2137-43f0-b18a-4c523f90d66a`
		// 	}
		// })
	}, [location]);

	useScrollToTop();

	return (
		<ReduxProvider store={store}>
			<AuthProvider>
				<QueryClientProvider client={queryClient}>
					<LocalizationProvider dateAdapter={AdapterDateFns}>
						<SettingsProvider
							defaultSettings={{
								themeMode: 'light',
								themeDirection: 'ltr',
							}}
						>
							<MotionLazyContainer>
								<ThemeProvider>
									<ThemeLocalization>
										<SnackbarProvider>
											<StyledChart />
											<ProgressBar />
											<PostHogProvider client={posthog}>
												<Router />
											</PostHogProvider>
										</SnackbarProvider>
									</ThemeLocalization>
								</ThemeProvider>
							</MotionLazyContainer>
						</SettingsProvider>
					</LocalizationProvider>
				</QueryClientProvider>
			</AuthProvider>
		</ReduxProvider>
	);
}
// Fake update to trigger build v3
