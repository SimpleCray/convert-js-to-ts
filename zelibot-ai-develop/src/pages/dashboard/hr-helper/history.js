import { APP_NAME } from '../../../config-global';
import CustomBreadcrumbs from '../../../components/custom-breadcrumbs';
import { PATH_DASHBOARD } from '../../../routes/paths';
import { Container } from '@mui/material';
import { DashboardLayout } from '../../../feature/dashboard';
import HrManagerHistory from '../../../feature/hr-manager/HrManagerHistory';
import { Helmet } from 'react-helmet-async';

export default function HrHelperHistoryPage() {
	return (
		<DashboardLayout>
			<Helmet>
				<title> HR Helper: History | {APP_NAME}</title>
			</Helmet>

			<Container>
				<CustomBreadcrumbs heading='History' links={[{ name: 'HR Helper', href: PATH_DASHBOARD.hrHelper.root }, { name: 'History' }]} />
				<HrManagerHistory />
			</Container>
		</DashboardLayout>
	);
}
