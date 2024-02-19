import { Suspense } from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
// import { GoogleOAuthProvider } from '@react-oauth/google';
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
	<HelmetProvider>
		<BrowserRouter>
			<Suspense>
				{/* <GoogleOAuthProvider
				clientId="425849844901-a9f48o1cpt3qh7quk6cba3scr8dihjhc.apps.googleusercontent.com"
				> */}
					<App />
				{/* </GoogleOAuthProvider> */}
			</Suspense>
		</BrowserRouter>
	</HelmetProvider>
);
