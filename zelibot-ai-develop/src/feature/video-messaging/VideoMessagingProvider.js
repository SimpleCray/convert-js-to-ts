import { ThemeProvider } from 'styled-components';
import { MeetingProvider, lightTheme } from 'amazon-chime-sdk-component-library-react';
import VideoMessaging from './VideoMessaging';
import AuthGuard from '../auth/context/AuthGuard';

export default function VideoMessagingProvider() {
	return (
		<AuthGuard>
			<ThemeProvider theme={lightTheme}>
				<MeetingProvider>
					<VideoMessaging />
				</MeetingProvider>
			</ThemeProvider>
		</AuthGuard>
	);
}
