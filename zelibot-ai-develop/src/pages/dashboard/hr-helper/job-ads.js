import { Helmet } from 'react-helmet-async';
import { APP_NAME } from '../../../config-global';
import CustomBreadcrumbs from '../../../components/custom-breadcrumbs';
import { PATH_DASHBOARD } from '../../../routes/paths';
import { Container } from '@mui/material';
import { DashboardLayout } from '../../../feature/dashboard';

export default function HrHelperJobAdsPage() {
	return (
		<DashboardLayout>
			<Helmet>
				<title> HR Helper: Job Ads | {APP_NAME}</title>
			</Helmet>

			<Container>
				<CustomBreadcrumbs heading='Job Ads' links={[{ name: 'HR Helper', href: PATH_DASHBOARD.hrHelper.root }, { name: 'Job Ads' }]} />
			</Container>
		</DashboardLayout>
	);
}
