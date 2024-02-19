import { useEffect, useRef, useState } from 'react';
import { createEmbeddingContext } from 'amazon-quicksight-embedding-sdk';
import { Box } from '@mui/material';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import { HUMAN_RESOURCES } from 'src/config-global';
import { AIGetAPIRequest } from '../ai-worker/constants';
import { useSnackbar } from 'notistack';
import { Loading } from 'src/components/loading-screen';

const QuicksightDashboard = ({ dashboard }) => {
    const { enqueueSnackbar } = useSnackbar();

    const dashboardOptions = [
        { id: 'db4c3154-d9af-4995-82c3-cc467f871cc7', label: 'Candidate List' },
    ];

    const endpoints = [
        `${HUMAN_RESOURCES.HUMAN_RESOURCES_API}/get_quicksight_dashboard?dashboard=${dashboard || 'candidates'}`,
    ];

    const [loading, setLoading] = useState(true);

	const dashboardRef = useRef([]);
	const [dashboardId, setDashboardId] = useState(dashboardOptions[0]);
    const [embeddedDashboard, setEmbeddedDashboard] = useState(null);
    const [dashboardUrl, setDashboardUrl] = useState(null);
    const [embeddingContext, setEmbeddingContext] = useState(null);

	useEffect(() => {
        const handleGetData = async () => {
            await AIGetAPIRequest(endpoints[0])
                .then((response) => {
                    if (response !== null) {
                        setDashboardUrl(response.EmbedUrl);
                        setLoading(false);
                    }
                })
                .catch((error) => {
                    console.error('error: ', error);
                    enqueueSnackbar('Error loading dashboard. Please try again later.', { variant: 'error' });
                });
        };
        const timeout = setTimeout(() => {
            setLoading(true);
            handleGetData();
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
			width: "100%",
			// height: "500px",
            resizeHeightOnSizeChangedEvent: true, // nice idea but it seems to like getting taller, but not shorter
		};
		
		try {
			const newEmbeddedDashboard = await embeddingContext.embedDashboard(options);
            setEmbeddedDashboard(newEmbeddedDashboard);
		} catch(e) {
			// console.log('embed error', e);
		}
	};
	
	useEffect(() => {
		if (embeddedDashboard) {
			embeddedDashboard.navigateToDashboard(dashboardId, {})
		}
	}, [dashboardId])

	const changeDashboard = async (_, option) => {
		const dashboardId = option.id;
		setDashboardId(dashboardId);
	}

    return (
        <Box sx={{ position: 'relative', minHeight: '400px' }}>
            {dashboardOptions.length > 1 && (
                <Autocomplete
                    options={dashboardOptions}
                    renderInput={(params) => <TextField {...params} label="Select dashboard" />}
                    onChange={changeDashboard}
                    defaultValue={dashboardOptions[0]}
                />
            )}
            {loading && <Loading />}
            <Box sx={{ position: 'absolute', top: 0, left: 0, height: '400px', width: '100%', zIndex: 0 }}>
                <Loading />
            </Box>
            <Box ref={dashboardRef} sx={{ 
                maxHeight: '600px',
                '& > *': {
                    maxHeight: '600px',
                },
                position: 'relative',
                zIndex: 99,
            }} />
        </Box>
    )
}

export default QuicksightDashboard;