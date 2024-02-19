import { useState, useEffect, useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import { Container } from '@mui/material';
import { useSnackbar } from 'notistack';
import { APP_NAME } from '../../../config-global';
import CustomBreadcrumbs from '../../../components/custom-breadcrumbs';
import { PATH_DASHBOARD } from '../../../routes/paths';
import { DashboardLayout } from '../../../feature/dashboard';
import { AIGetAPIRequest } from 'src/feature/ai-worker/constants';

import AuthGuard from 'src/feature/auth/context/AuthGuard';
import { JobOpeningsList } from 'src/feature/shared-components';
import { useAuthContext } from 'src/feature/auth/context/useAuthContext';
import { ORDER_TYPE, getCustomComparator, useTable } from 'src/components/table';
import TableHeadAction from 'src/feature/ai-worker/components/ats/table-card/TableHeadAction';

export default function HrHelperOpenJobsPage() {
	const { enqueueSnackbar } = useSnackbar();
	const { isAuthenticated } = useAuthContext();

	const [tableData, setTableData] = useState([]);
	const [loading, setLoading] = useState(false);

	// Duplicated, move it somewhere
	const getTimeElapsedInDays = (timestamp) => {
		const ts = new Date(timestamp);
		const now = new Date();
		const dayMs = 1000 * 60 * 60 * 24;
		const diff = now.getTime() - ts.getTime();
		const days = Math.round(diff / dayMs) ?? 0;
		return days;
	};
	const { order, orderBy, orderType, onSort } = useTable({ defaultOrderBy: 'job_title', defaultOrder: 'asc', defaultOrderType: ORDER_TYPE.ALPHABETICALLY });
	const TABLE_HEAD = [
		{ id: 'job_title', label: <TableHeadAction id='job_title' order={order} orderBy={orderBy} onSort={onSort} title='Job Title' orderType={ORDER_TYPE.ALPHABETICALLY} />, align: 'left', sort: false },
		{ id: 'company', label: <TableHeadAction id='company' order={order} orderBy={orderBy} onSort={onSort} title='Company / Department' orderType={ORDER_TYPE.ALPHABETICALLY} />, align: 'center', sort: false },
		{ id: 'candidates', label: <TableHeadAction id='candidates' order={order} orderBy={orderBy} onSort={onSort} title='Candidates' orderType={ORDER_TYPE.NUMBER} />, align: 'center', sort: false },
		{ id: 'days_open', label: <TableHeadAction id='days_open' order={order} orderBy={orderBy} onSort={onSort} title='Days open' orderType={ORDER_TYPE.NUMBER} />, align: 'center', sort: false },
	];

	const handleRowClick = (_, row) => {
		const jobId = row.job_opening_id;
		// outputCardAction(undefined, 'JOB_OPENING', { id: jobId });
	};

	useEffect(() => {
		const handleGetJobOpenings = async () => {
			setLoading(true);
			await AIGetAPIRequest(`${process.env['API_JOB_OPENING_MS']}/get_job_openings`)
				.then((response) => {
					if (response !== null) {
						const jobs = response.map((r) => {
							return {
								job_opening_id: r?.job_opening_id,
								job_title: { value: r?.job_title },
								company: { value: r.client_name ?? 'Unknown' },
								candidates: { value: Math.round(Math.random() * 5), icon: 'PERSON' },
								days_open: { value: getTimeElapsedInDays(r?.utc_date_created) + '' },
							};
						});
						setTableData(jobs);
						setLoading(false);
					}
				})
				.catch((error) => {
					console.error('error: ', error);
					enqueueSnackbar('Error fetching open jobs. Please try again later.', { variant: 'error' });
					setLoading(false);
				});
		};
		if (isAuthenticated) {
			void handleGetJobOpenings();
		}
	}, [isAuthenticated]);

	const sortedData = useMemo(() => {
		return tableData?.toSorted((a, b) => {
			const valueA = a[orderBy]?.value;
			const valueB = b[orderBy]?.value;
			return getCustomComparator({ valueA, valueB, order, orderType });
		});
	}, [tableData, order, orderBy, orderType]);

	return (
		<AuthGuard>
			<DashboardLayout>
				<Helmet>
					<title> HR Helper: Open Jobs | {APP_NAME}</title>
				</Helmet>

				<Container>
					<CustomBreadcrumbs heading='Open Jobs' links={[{ name: 'HR Helper', href: PATH_DASHBOARD.hrHelper.root }, { name: 'Open Jobs' }]} />
					<JobOpeningsList tableHead={TABLE_HEAD} tableData={sortedData} loading={loading} />
				</Container>
			</DashboardLayout>
		</AuthGuard>
	);
}
