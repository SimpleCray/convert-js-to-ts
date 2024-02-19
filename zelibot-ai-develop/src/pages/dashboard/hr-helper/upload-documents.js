import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Container } from '@mui/material';
import { useSnackbar } from 'notistack';
import { APP_NAME } from '../../../config-global';
import CustomBreadcrumbs from '../../../components/custom-breadcrumbs';
import { PATH_DASHBOARD } from '../../../routes/paths';
import { DashboardLayout } from '../../../feature/dashboard';
import { AIGetAPIRequest } from 'src/feature/ai-worker/constants';
import AuthGuard from 'src/feature/auth/context/AuthGuard';
import { useAuthContext } from 'src/feature/auth/context/useAuthContext';
import { Table as CustomTable, TableRow as CustomTableRow } from 'src/feature/ai-worker/components/ats';
import { Loading } from 'src/components/loading-screen';

const FileIconType = (type) => {
	switch (type) {
		case 'pdf':
			return 'FILE';
        case 'docx':
            return 'DOC';
        case 'mp4':
            return 'VIDEO';
		default:
			return 'FILE';
	}
}

export default function HrHelperUploadDocumentsPage() {
	const { enqueueSnackbar } = useSnackbar();
	const { isAuthenticated } = useAuthContext();

	const [tableData, setTableData] = useState([]);
	const [loading, setLoading] = useState(false);

	const TABLE_HEAD = [
		{ id: 'document', label: 'Document', align: 'left' },
		{ id: 'date', label: 'Date', align: 'center' },
		{ id: 'source', label: 'Source', align: 'center' },
		{ id: 'type', label: 'Type', align: 'center' },
	];

	useEffect(() => {
		const handleGetDocuments = async () => {
			setLoading(true);
			await AIGetAPIRequest(`${process.env['API_HR_ATS_MS']}/get_job_opening_documents`)
				.then((response) => {
					if (response !== null) {
						const files = response.map((f, i) => {
							return {
								document_id: i,
								document: { value: f.file_name },
								date: { value: f.utc_date_created.split(' ')[0] },
								source: { value: 'Zeli' },
								type: { value: f.file_type, icon: FileIconType(f.file_type) },
								edit: { value: '', menu: true },
							};
						});
						setTableData(files);
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
			void handleGetDocuments();
		}
	}, [isAuthenticated]);

	return (
		<DashboardLayout>
			<Helmet>
				<title> HR Helper: Upload Documents | {APP_NAME}</title>
			</Helmet>

			<Container>
				<CustomBreadcrumbs heading='Upload Documents' links={[{ name: 'HR Helper', href: PATH_DASHBOARD.hrHelper.root }, { name: 'Upload Documents' }]} />
				{loading && <Loading />}
				<Documents
					tableData={tableData}
					TABLE_HEAD={TABLE_HEAD}
				/>
			</Container>
		</DashboardLayout>
	);
}

const Documents = ({
    tableData,
    TABLE_HEAD,
    fileToDelete,
}) => {
    return (
        <CustomTable dataFiltered={[]} tableData={tableData} tableHead={TABLE_HEAD} isNotFound={tableData.length < 1}>
            {tableData
                .filter((f) => f.document_id !== fileToDelete)
                .map((row, index) => (
                    <CustomTableRow
                        key={index}
                        row={row}
                        enableRowClick={false}
                        isNotFound={!tableData.length}
                    />
                ))}
        </CustomTable>
    )
}
