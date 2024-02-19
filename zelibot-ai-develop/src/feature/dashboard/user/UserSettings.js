import {useState} from 'react';
import {Stack, styled, Tab, Tabs} from '@mui/material';

import {AccountGeneral} from '../components/user/account';
import {USER_TABS} from '../components/user/account/constants';

// ----------------------------------------------------------------------
// All rights reserved - SEDZ PTY LTD - 2023
// ----------------------------------------------------------------------

const StyledTabs = styled(Tabs)(({ theme }) => ({
    '&.MuiTabs-root': {
        minHeight: 'inherit',
        '& > .MuiTabs-scroller > .MuiTabs-indicator': {
            backgroundColor: theme.palette.primary.light,
        },
    }
}));

const StyledTab = styled(Tab)(({ theme }) => ({
    '&.MuiButtonBase-root.MuiTab-root': {
        fontSize: 14,
        fontWeight: 600,
        lineHeight: 1.4,
        minHeight: 'inherit',
        padding: `${theme.spacing(1)} 0`,
        '&.Mui-selected': {
            color: theme.palette.primary.light,
            borderBottomColor: theme.palette.primary.light,
        },
        '&:not(:last-of-type)': {
            marginRight: `${theme.spacing(2)}`,
        },
        '& svg.MuiTab-iconWrapper': {
            width: 24,
            height: 24,
            marginRight: theme.spacing(0.5),
        }
    },
}))

export default function DashboardUserSettings({ activeTab, onClose, setStateShouldUpdate, ...props}) {
	const [currentTab, setCurrentTab] = useState(activeTab ? activeTab : 'general');

	const onChangeTabOpenLink = (event, newValue) => {
		setCurrentTab(newValue);
	};

	const ComponentToRender = currentTab ? USER_TABS.find((tab) => tab.value === currentTab).component : AccountGeneral;
	return (
        <Stack gap={2}>
            <StyledTabs value={currentTab} onChange={onChangeTabOpenLink}>
                {USER_TABS.map((tab) => (
                    <StyledTab key={tab.value} label={tab.label} icon={tab.icon} value={tab.value} />
                ))}
            </StyledTabs>

            <ComponentToRender setStateShouldUpdate={setStateShouldUpdate} onClose={onClose}/>
        </Stack>
	);
}
