import { useEffect, useRef, useState } from 'react';
import { styled } from '@mui/material/styles';
import { useSnackbar } from 'notistack';
import { APP_NAME } from '../../../config-global';
import CustomBreadcrumbs from '../../../components/custom-breadcrumbs';
import { PATH_DASHBOARD } from '../../../routes/paths';
import { Container } from '@mui/material';
import { Helmet } from 'react-helmet-async';
import { createEmbeddingContext } from 'amazon-quicksight-embedding-sdk';
import { DashboardLayout } from '../../../feature/dashboard';

import { AIGetAPIRequest } from 'src/feature/ai-worker/constants';
import AuthGuard from 'src/feature/auth/context/AuthGuard';
import { useAuthContext } from 'src/feature/auth/context/useAuthContext';

import QuicksightDashboard from 'src/feature/quicksight/Quicksight';

const StyledIframe = styled('iframe')(({ theme }) => ({
	border: 'none',
}));

export default function HrHelperCandidatesPage() {
	/*
	* Quicksight experimental stuff
	*/
	const dashboardRef = useRef([]);
	const [dashboardId, setDashboardId] = useState('db4c3154-d9af-4995-82c3-cc467f871cc7');
	const [embeddedDashboard, setEmbeddedDashboard] = useState(null);
	const [dashboardUrl, setDashboardUrl] = useState(null);
	const [embeddingContext, setEmbeddingContext] = useState(null);
  
	useEffect(() => {
	  const timeout = setTimeout(() => {
		fetch("https://ubbeqlobo4.execute-api.ap-southeast-2.amazonaws.com/Test/anonymous-embed"
		).then((response) => response.json()
		).then((response) => {
		  setDashboardUrl(response.EmbedUrl)
		})
	  }, 10);
	  return () => clearTimeout(timeout);
	}, []);
  
	const createContext = async () => {
	  const context = await createEmbeddingContext();
	  setEmbeddingContext(context);
	}
  
	useEffect(() => {
	  if (dashboardUrl) { createContext() }
	}, [dashboardUrl])
  
	useEffect(() => {
	  if (embeddingContext) { embed(); }
	}, [embeddingContext])
  
	const embed = async () => {
  
	  const options = {
		url: dashboardUrl,
		container: dashboardRef.current,
		height: "500px",
		width: "600px",
		resizeHeightOnSizeChangedEvent: true,
	  };
  
	  const newEmbeddedDashboard = await embeddingContext.embedDashboard(options);
	  setEmbeddedDashboard(newEmbeddedDashboard);
	};
  
	useEffect(() => {
	  if (embeddedDashboard) {
		embeddedDashboard.navigateToDashboard(dashboardId, {})
	  }
	}, [dashboardId])
  
	const changeDashboard = async (e) => {
	  const dashboardId = e.target.value
	  setDashboardId(dashboardId)
	}
	/*
	* End quicksight experimental stuff
	*/

	const { enqueueSnackbar } = useSnackbar();
	const { isAuthenticated } = useAuthContext();

	const [tableData, setTableData] = useState([]);
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		const handleGetDocuments = async () => {
			setLoading(true);
			await AIGetAPIRequest(`${process.env['API_HR_ATS_MS']}/get_job_opening_candidates`)
				.then((response) => {
					if (response !== null) {
						// console.log('response', response);
						const files = response.map((f, i) => {
							return {
								candidate_id: r.candidate_id,
								name: { value: r.friendly_name },
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
				<title> HR Helper: Candidates | {APP_NAME}</title>
			</Helmet>

			<Container >
				<CustomBreadcrumbs heading='Candidates' links={[{ name: 'HR Helper', href: PATH_DASHBOARD.hrHelper.root }, { name: 'Candidates' }]} />
				<QuicksightDashboard dashboard="candidates" />
				{/* <StyledIframe 
					src={dashboardUrl}
					title="Dashboard"
					width="100%"
					height="500px"
				/> */}
			</Container>
		</DashboardLayout>
	);
};
	