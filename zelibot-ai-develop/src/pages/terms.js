import Layout from '../feature/website/layout';
import { Helmet } from 'react-helmet-async';
import { TERMS_PAGE } from '../constants';
import { APP_NAME } from '../config-global';
import { Stack, Container, Typography } from '@mui/material';
import {useScrollToLocation} from '../hooks/useScrollToLocation';

export default function TermsPage() {
	const { title, content } = TERMS_PAGE;

	useScrollToLocation();

	return (
		<Layout headerStyle={'light'}>
			<Helmet>
				<title>
					{title} | {APP_NAME}
				</title>
			</Helmet>
			<Container sx={{ color: 'white', opacity: 0.8 }}>
				<Stack direction={{ xs: 'column', sm: 'row' }} alignItems='center' justifyContent='space-between' sx={{ my: { xs: 10 } }}>
					<Stack>
						<Typography variant='h1' gutterBottom>
							{title}
						</Typography>
						<Typography component={'div'} dangerouslySetInnerHTML={{ __html: content }} />
					</Stack>
				</Stack>
			</Container>
		</Layout>
	);
}
