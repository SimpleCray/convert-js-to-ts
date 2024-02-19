import React, { useEffect, useMemo, useState } from 'react';
import { Stack, Typography, TextField, InputAdornment, InputBase } from '@mui/material';
import CheckCircleOutlineOutlinedIcon from '@mui/icons-material/CheckCircleOutlineOutlined';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import HourglassBottomIcon from '@mui/icons-material/HourglassBottom';
import SearchIcon from '@mui/icons-material/Search';
import { AIGetAPIRequest } from '../../../constants';
import { ORDER_TYPE, TableNoData, getCustomComparator, useTable } from '../../../../../components/table';
import TableHeadAction from '../../ats/table-card/TableHeadAction';
import moment from 'moment';
import { Loading } from '../../../../../components/loading-screen';
import UserFeedback from '../../../../../components/user-feedback/UserFeedback';
import OutputCard from '../OutputCard';
import VideoCameraFrontOutlinedIcon from '@mui/icons-material/VideoCameraFrontOutlined';

const INTERVIEW_STATUSES = {
	NOT_SET: 'Not Set',
	INVITED: 'Invited',
	DONE: 'Done',
};

const PrescreeningOverview = ({ type, event_id, clickRequestAction, handleCardClose, ...props }) => {
	const [data, setData] = useState([]);
	const [candidatesList, setCandidatesList] = useState([]);
	const [loading, setLoading] = useState(true);
	const [dataNotFound, setDataNotFound] = useState(false);
	const [searchBarVisible, setSearchBarVisible] = useState(false);
	const [searchValue, setSearchValue] = useState('');

	const { order, orderBy, onSort, orderType } = useTable({
		defaultOrderBy: 'document',
		defaultOrder: 'asc',
		defaultOrderType: ORDER_TYPE.ALPHABETICALLY,
	});

	const sortedData = useMemo(() => {
		return candidatesList?.toSorted((a, b) => {
			let valueA = a[orderBy];
			let valueB = b[orderBy];
			if (orderType === ORDER_TYPE.TIME) {
				valueA = moment(valueA).format('DD/MM/YYYY');
				valueB = moment(valueB).format('DD/MM/YYYY');
			}
			return getCustomComparator({
				valueA,
				valueB,
				order,
				orderType,
				timeFormat: 'DD/MM/YYYY',
			});
		});
	}, [candidatesList, order, orderBy, orderType]);

	const handleDataFilter = (e) => {
		let searchableData = data.filter((item) => item.pre_screening_interview_status !== INTERVIEW_STATUSES.NOT_SET);
		setSearchValue(e.target.value);
		let filteredData = searchableData.filter((candidate) => {
			return (
				candidate.friendly_name.toLowerCase().includes(e.target.value.toLowerCase()) ||
				candidate.first_name.toLowerCase().includes(e.target.value.toLowerCase()) ||
				candidate.last_name.toLowerCase().includes(e.target.value.toLowerCase()) ||
				candidate.job_title.toLowerCase().includes(e.target.value.toLowerCase()) ||
				candidate.pre_screening_interview_status.toLowerCase().includes(e.target.value.toLowerCase()) ||
				new Date(candidate.invite_date).toLocaleDateString().includes(e.target.value)
			);
		});
		setCandidatesList(filteredData);
	};

	const handleClearSearch = () => {
		setSearchValue('');
		setSearchBarVisible(false);
		setCandidatesList(data);
	};

	const fetchPrescreeningOverviewData = async () => {
		let requestURL = process.env['API_VIDEO_CHAT'] + '/get_pre_screening_interview_summary';
		let response = await AIGetAPIRequest(requestURL);
		// console.log('Prescreening Response: ', response);
		// Filter data by candidates whose status is not NOT SET
		let filteredData = response.filter((candidate) => {
			return candidate.pre_screening_interview_status !== INTERVIEW_STATUSES.NOT_SET;
		});
		if (filteredData.length === 0) {
			setDataNotFound(true);
		}
		setData(filteredData);
		setCandidatesList(filteredData);
		setLoading(false);
	};

	const handleDataLinking = (type, candidate) => {
		if (type === 'job_title') {
			clickRequestAction(undefined, 'JOB_OPENING', { id: candidate.job_opening_id, title: candidate.job_title });
			return;
		}

		if (type === 'friendly_name') {
			clickRequestAction(undefined, 'WSC_CANDIDATE_PROFILE', { candidate_id: candidate.candidate_id, job_id: candidate.job_opening_id });
			return;
		}
	};

	const handleCandidateClick = (candidate) => {
		clickRequestAction(undefined, 'OPEN_CANDIDATE_PRESCREEN_REVIEW', { candidate_id: candidate.candidate_id, job_opening_id: candidate.job_opening_id, pre_screening_interview_id: candidate?.pre_screening_interview_id, meeting_id: candidate?.meeting_id });
	};

	useEffect(() => {
		fetchPrescreeningOverviewData();
	}, []);

	return (
		<OutputCard isATSCard title={'Pre-screening interview overview'} titleIcon={<VideoCameraFrontOutlinedIcon />} closeCard={() => handleCardClose(props)}>
			<Stack gap={2} flexDirection={'column'} sx={{ backgroundColor: 'white', borderRadius: '16px', width: '100%', maxWidth: '675px' }}>
				{/* Body */}
				<Stack flexDirection={'column'} gap={1}>
					{/* Header */}
					<Stack gap={1} px={0.5} py={1} sx={{ backgroundColor: '#21054C', color: 'white', borderRadius: '8px 8px 0px 0px' }} flexDirection={'row'} justifyContent={'space-between'} alignItems={'center'}>
						<Stack justifyContent={'center'} alignItems={'center'} flexDirection={'row'} sx={{ width: '30%', overflow: 'hidden', cursor: 'pointer', fontSize: '14px' }}>
							<TableHeadAction id='friendly_name' order={order} orderBy={orderBy} onSort={onSort} title='Candidate name' orderType={ORDER_TYPE.ALPHABETICALLY} />
						</Stack>
						<Stack textAlign={'center'} justifyContent={'center'} alignItems={'center'} flexDirection={'row'} sx={{ width: '30%', overflow: 'hidden', cursor: 'pointer', fontSize: '14px' }}>
							<TableHeadAction id='job_title' order={order} orderBy={orderBy} onSort={onSort} title='Applied for' orderType={ORDER_TYPE.ALPHABETICALLY} />
						</Stack>
						<Stack gap={0.5} justifyContent={'center'} alignItems={'center'} flexDirection={'row'} sx={{ width: '20%', overflow: 'hidden', cursor: 'pointer', fontSize: '14px' }}>
							<TableHeadAction id='invite_date' order={order} orderBy={orderBy} onSort={onSort} title='Date' orderType={ORDER_TYPE.TIME} />
						</Stack>
						<Stack justifyContent={'center'} alignItems={'center'} flexDirection={'row'} sx={{ width: '20%', overflow: 'hidden', cursor: 'pointer', fontSize: '14px' }}>
							<TableHeadAction id='pre_screening_interview_status' order={order} orderBy={orderBy} onSort={onSort} title='Status' orderType={ORDER_TYPE.ALPHABETICALLY} />
						</Stack>
					</Stack>
					{
						sortedData.length === 0 ? (
							<Stack justifyContent={'center'} alignItems={'center'}>
								<table>
									<tbody>
										<TableNoData isNotFound={dataNotFound} />
									</tbody>
								</table>
							</Stack>
						) : (
							<Stack sx={{ maxHeight: '325px', overflowY: 'auto' }}>
								{sortedData.map((candidate, index) => {
									return (
										<Stack
											sx={{ borderBottom: '1px solid #E4E5E7', minHeight: '50px', cursor: candidate.pre_screening_interview_status === INTERVIEW_STATUSES.DONE ? 'pointer' : 'default' }}
											onClick={() => candidate.pre_screening_interview_status === INTERVIEW_STATUSES.DONE && handleCandidateClick(candidate)}
											key={'candidate-prescreening-data-' + index}
											gap={1}
											flexDirection={'row'}
											justifyContent={'space-between'}
											px={0.5}
											py={1}
										>
											<Stack justifyContent={'center'} alignItems={'flex-start'} sx={{ width: '30%', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
												<Typography onClick={() => candidate.pre_screening_interview_status !== INTERVIEW_STATUSES.DONE && handleDataLinking('friendly_name', candidate)} sx={{ "&:hover": { textDecoration: 'underline', cursor: 'pointer' }, color: '#9859E0', fontSize: '16px', fontWeight: 400, whiteSpace: 'nowrap', textOverflow: 'ellipsis', width: '100%', overflow: 'hidden' }}>
													{candidate.first_name} {candidate.last_name}
												</Typography>
											</Stack>
											<Stack justifyContent={'center'} alignItems={'flex-start'} sx={{ width: '30%', overflow: 'hidden' }}>
												<Typography onClick={() => candidate.pre_screening_interview_status !== INTERVIEW_STATUSES.DONE && candidate.job_title !== '-' && candidate?.job_title && handleDataLinking('job_title', candidate)} textAlign={'left'} sx={{ "&:hover": { textDecoration: candidate.job_title !== '-' && 'underline', color: candidate.job_title !== '-' && '#9859E0', cursor: candidate.job_title !== '-' && 'pointer' }, fontSize: '14px', fontWeight: 400, whiteSpace: 'nowrap', textOverflow: 'ellipsis', width: '100%', overflow: 'hidden' }}>
													{candidate.job_title}
												</Typography>
											</Stack>
											<Stack justifyContent={'center'} alignItems={'center'} sx={{ width: '20%', overflow: 'hidden' }}>
												<Typography sx={{ fontSize: '14px', fontWeight: 400, whiteSpace: 'nowrap', textOverflow: 'ellipsis', width: '100%', overflow: 'hidden' }}>{new Date(candidate?.utc_date_interviewed ? candidate?.utc_date_interviewed : candidate?.invite_date).toLocaleDateString()}</Typography>
											</Stack>
											<Stack gap={0.5} flexDirection={'row'} justifyContent={'center'} alignItems={'center'} sx={{ width: '20%', overflow: 'hidden' }}>
												{candidate.pre_screening_interview_status === INTERVIEW_STATUSES.NOT_SET ? (
													<HourglassBottomIcon sx={{ color: '#FFB800', fontSize: '22px' }} />
												) : candidate.pre_screening_interview_status === INTERVIEW_STATUSES.INVITED ? (
													<EmailOutlinedIcon sx={{ color: '#9859E0', fontSize: '22px' }} />
												) : (
													<CheckCircleOutlineOutlinedIcon sx={{ color: '#46BCA5', fontSize: '22px' }} />
												)}
												<Typography sx={{ fontSize: '14px', fontWeight: 400, whiteSpace: 'nowrap', textOverflow: 'ellipsis', width: '100%', overflow: 'hidden' }}>{candidate.pre_screening_interview_status}</Typography>
											</Stack>
										</Stack>
									);
								})}
							</Stack>
						)}
					{searchBarVisible && (
						<TextField
							sx={{ width: '100%', overflow: 'hidden' }}
							inputProps={{
								style: {
									// padding: 0
								},
							}}
							InputProps={{
								endAdornment: (
									<Stack onClick={() => handleClearSearch()} justifyContent={'center'} alignItems={'center'} sx={{ backgroundColor: '#170058', height: '52px', width: '52px', borderRadius: '0px 8px 8px 0px', cursor: 'pointer' }}>
										<SearchIcon sx={{ color: 'white' }} />
									</Stack>
								),
								disableUnderline: true,
								style: { padding: 0 }, // Optional: Adjust padding if needed
							}}
							value={searchValue}
							onChange={(e) => handleDataFilter(e)}
							id='outlined-basic'
							placeholder='Filter'
							variant='outlined'
						/>
					)}
				</Stack>
			</Stack>
		</OutputCard>
	);
};

export default PrescreeningOverview;
