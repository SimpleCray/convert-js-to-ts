import { useState } from 'react';
// @mui
import { Container, Tab, Tabs } from '@mui/material';
// routes
import { PATH_DASHBOARD } from '../../../routes/paths';
// layouts
import DashboardLayout from '../layout';
import CustomBreadcrumbs from '../../../components/custom-breadcrumbs';
// sections
import { AccountGeneral } from '../components/user/account';
import { APP_NAME } from '../../../config-global';
import { USER_TABS } from '../components/user/account/constants';
import { useRouter } from 'src/hooks/useRouter';
import { Helmet } from 'react-helmet-async';

// ----------------------------------------------------------------------
// All rights reserved - SEDZ PTY LTD - 2023
// ----------------------------------------------------------------------

export default function DashboardUserAccount() {
	const { push } = useRouter();
	const [currentTab, setCurrentTab] = useState('general');

	const onChangeTabOpenLink = (event, newValue) => {
		setCurrentTab(newValue);
		void push(USER_TABS.find((tab) => tab.value === newValue).link);
	};

	return (
		<DashboardLayout>
			<Helmet>
				<title> Profile: Edit Profile | {APP_NAME}</title>
			</Helmet>

			<Container>
				<CustomBreadcrumbs heading='Profile' links={[{ name: 'Dashboard', href: PATH_DASHBOARD.root }, { name: 'Profile' }]} />
				<Tabs value={currentTab} onChange={onChangeTabOpenLink}>
					{USER_TABS.map((tab) => (
						<Tab key={tab.value} label={tab.label} icon={tab.icon} value={tab.value} />
					))}
				</Tabs>

				<AccountGeneral sx= {{ gap: '16px'}}/>
			</Container>
		</DashboardLayout>
	);
}
