import { useState } from 'react';
// @mui
import { Container, Tab, Tabs } from '@mui/material';
// routes
import { PATH_DASHBOARD } from '../../../routes/paths';

// layouts
import DashboardLayout from '../layout';
import CustomBreadcrumbs from '../../../components/custom-breadcrumbs';
// sections
import { AccountSocialLinks } from '../components/user/account';
import { APP_NAME } from '../../../config-global';
import { USER_TABS } from '../components/user/account/constants';
import { useRouter } from 'src/hooks/useRouter';
import { Helmet } from 'react-helmet-async';

export default function DashboardUserSocialLinks() {
	const { push } = useRouter();
	const [currentTab, setCurrentTab] = useState('social_links');
	const onChangeTabOpenLink = (event, newValue) => {
		setCurrentTab(newValue);
		void push(USER_TABS.find((tab) => tab.value === newValue).link);
	};

	return (
		<DashboardLayout>
			<Helmet>
				<title>User: Social Links | {APP_NAME}</title>
			</Helmet>

			<Container>
				<CustomBreadcrumbs heading='Social Links' links={[{ name: 'Dashboard', href: PATH_DASHBOARD.root }, { name: 'Profile', href: PATH_DASHBOARD.user.root }, { name: 'Social Links' }]} />
				<Tabs onChange={onChangeTabOpenLink} value={currentTab}>
					{USER_TABS.map((tab) => (
						<Tab key={tab.value} label={tab.label} icon={tab.icon} value={tab.value} />
					))}
				</Tabs>
				<AccountSocialLinks />
			</Container>
		</DashboardLayout>
	);
}
