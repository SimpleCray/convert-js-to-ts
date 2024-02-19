import { APP_NAME } from '../../../config-global';
import CustomBreadcrumbs from '../../../components/custom-breadcrumbs';
import { PATH_DASHBOARD } from '../../../routes/paths';
import { Container } from '@mui/material';
import { DashboardLayout } from '../../../feature/dashboard';
import { Helmet } from 'react-helmet-async';

export default function HrHelperPhoneCandidatePage() {
	return (
		<DashboardLayout>
			<Helmet>
				<title> HR Helper: Phone Candidate | {APP_NAME}</title>
			</Helmet>

			<Container>
				<CustomBreadcrumbs heading='Phone Candidate' links={[{ name: 'HR Helper', href: PATH_DASHBOARD.hrHelper.root }, { name: 'Phone Candidate' }]} />
			</Container>
		</DashboardLayout>
	);
}
