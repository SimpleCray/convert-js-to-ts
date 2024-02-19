import { APP_NAME } from '../../../config-global';
import CustomBreadcrumbs from '../../../components/custom-breadcrumbs';
import { PATH_DASHBOARD } from '../../../routes/paths';
import { Container } from '@mui/material';
import { DashboardLayout } from '../../../feature/dashboard';
import { Helmet } from 'react-helmet-async';

export default function HrHelperSendSmsPage() {
	return (
		<DashboardLayout>
			<Helmet>
				<title> HR Helper: Send SMS | {APP_NAME}</title>
			</Helmet>

			<Container>
				<CustomBreadcrumbs heading='Send SMS' links={[{ name: 'HR Helper', href: PATH_DASHBOARD.hrHelper.root }, { name: 'Send SMS' }]} />
			</Container>
		</DashboardLayout>
	);
}
