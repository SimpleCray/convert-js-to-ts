import React, { useEffect, useMemo, useState } from 'react';
import { Stack, Typography, TextField, InputAdornment, InputBase, IconButton, Menu, MenuItem } from '@mui/material';
import { AIGetAPIRequest, AIPostAPIRequest } from '../../../constants';
import { ORDER_TYPE, TableNoData, getCustomComparator, useTable } from '../../../../../components/table';
import TableHeadAction from '../../ats/table-card/TableHeadAction';
import moment from 'moment';
import { Loading } from '../../../../../components/loading-screen';
import { MoreVert } from '@mui/icons-material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import SearchIcon from '@mui/icons-material/Search';
import { openModal } from '../../../../../redux/slices/modal';
import { useDispatch, useSelector } from 'react-redux';
import { clearRefreshComponent } from '../../../../../redux/slices/refresh';
import { API_DELETE_CLIENT_DETAILS } from '../../../../../config-global';
import { useSnackbar } from 'notistack';
import UserFeedback from '../../../../../components/user-feedback/UserFeedback';
import OutputCard from '../OutputCard';
import BusinessCenterOutlinedIcon from '@mui/icons-material/BusinessCenterOutlined';

const ClientsList = ({ target_url,
	outputCardAction,
	compound_component,
	clickRequestAction,
	handleCardClose,
	...props }) => {
	const { enqueueSnackbar } = useSnackbar();
	const [data, setData] = useState([]);
	const [clientsList, setClientsList] = useState([]);
	const [loading, setLoading] = useState(true);
	const [dataNotFound, setDataNotFound] = useState(false);
	const [searchBarVisible, setSearchBarVisible] = useState(false);
	const [searchValue, setSearchValue] = useState('');
	const refreshComponent = useSelector((state) => state.refresh.component);
	const dispatch = useDispatch();

	const { order, orderBy, onSort, orderType } = useTable({
		defaultOrderBy: 'document',
		defaultOrder: 'asc',
		defaultOrderType: ORDER_TYPE.ALPHABETICALLY,
	});

	const sortedData = useMemo(() => {
		return clientsList?.toSorted((a, b) => {
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
	}, [clientsList, order, orderBy, orderType]);

	const handleDataFilter = (e) => {
		let searchableData = data;
		setSearchValue(e.target.value);
		let filteredData = searchableData.filter((client) => {
			return client.client_name.toLowerCase().includes(e.target.value.toLowerCase());
		});
		// console.log('Filtering clients list by search ', filteredData);
		if (filteredData.length === 0) {
			setDataNotFound(true);
		} else {
			setDataNotFound(false);
		}
		setClientsList(filteredData);
	};

	const handleClearSearch = () => {
		setSearchValue('');
		setSearchBarVisible(false);
		setClientsList(data);
	};

	const handleEditClientClick = (client, index) => {
		// console.log('Clicked edit client', client, index);
		window.sessionStorage.removeItem('edit-client-value');
		window.sessionStorage.setItem('edit-client-value', JSON.stringify(client));
		dispatch(openModal({ component: 'EDIT CLIENT' }));
		handleCloseMenu();
	};

	const handleCreateNewClientClick = () => {
		window.sessionStorage.removeItem('edit-client-value');
		dispatch(openModal({ component: 'EDIT CLIENT' }));
	};

	const fetchClientsData = async () => {
		setLoading(true);
		const { target_api_endpoint, target_path } = compound_component[0];
		const API = process.env[`API_${target_api_endpoint}`];
		let response = await AIGetAPIRequest(`${API}/${target_path}`);
		// console.log('Prescreening Response: ', response);
		// Filter data by candidates whose status is not NOT SET
		if (response.length === 0) {
			setDataNotFound(true);
		}
		setData(response);
		setClientsList(response);
		setLoading(false);
	};

	const handleOpenClientDetails = async (client, index) => {
		clickRequestAction(null, 'CLIENT_DETAILS', client?.client_id);
	}

	const handleDeleteClient = async (client) => {
		const API = API_DELETE_CLIENT_DETAILS;
		const body = {
			client_id: client.client_id
		}
		let response = await AIPostAPIRequest(API, body);
		// console.log('Delete client response is >>> ', response);
		if (response === "Deleting client details successfully.") {
			enqueueSnackbar('Client deleted', { variant: 'success' });
			fetchClientsData();
		} else {
			enqueueSnackbar('Error deleting client details', { variant: 'error' });
		}
	}

	const MenuButton = ({ client, index }) => {
		const [anchorMenuEl, setAnchorEl] = useState(null);
		const open = Boolean(anchorMenuEl);

		const openMenuFunction = (event) => {
			setAnchorEl(event.currentTarget);
		};

		const handleCloseMenu = () => {
			setAnchorEl(null);
		};

		return (
			<Stack justifyContent={'center'} alignItems={'center'} sx={{ width: '10%' }}>
				<IconButton onClick={(e) => openMenuFunction(e)}>
					<MoreVert sx={{ color: '#9859E0' }} />
				</IconButton>
				<Menu
					anchorEl={anchorMenuEl}
					open={open}
					onClose={handleCloseMenu}
					MenuListProps={{
						'aria-labelledby': 'basic-button',
					}}
				>
					<MenuItem onClick={() => handleEditClientClick(client, index)} sx={{ boxShadow: 'none' }}>
						Edit Client
					</MenuItem>
					{/* <MenuItem sx={{ boxShadow: 'none' }} onClick={() => handleDeleteClient(client)}>Delete Client</MenuItem> */}
				</Menu>
			</Stack>
		);
	};

	useEffect(() => {
		if (refreshComponent === 'CLIENT_LIST') {
			// console.log('Refetching candidate list data')
			fetchClientsData();
			dispatch(clearRefreshComponent());
		}
	}, [refreshComponent]);

	useEffect(() => {
		fetchClientsData();
	}, []);

	return (
		<OutputCard isATSCard title={'Clients'} titleIcon={<BusinessCenterOutlinedIcon />} closeCard={() => handleCardClose(props)}>
			<Stack gap={2} flexDirection={'column'}>

				{/* Body */}
				<Stack flexDirection={'column'} gap={1}>
					{/* Header */}
					<Stack gap={1} px={0.5} py={1} sx={{ backgroundColor: '#21054C', color: 'white', borderRadius: '8px 8px 0px 0px' }} flexDirection={'row'} justifyContent={'space-between'} alignItems={'center'}>
						<Stack justifyContent={'flex-start'} alignItems={'center'} flexDirection={'row'} sx={{ width: '65%', overflow: 'hidden', cursor: 'pointer', fontSize: '14px' }}>
							<TableHeadAction id='client_name' order={order} orderBy={orderBy} onSort={onSort} title='Clients' orderType={ORDER_TYPE.ALPHABETICALLY} />
						</Stack>
						<Stack textAlign={'center'} justifyContent={'center'} alignItems={'center'} flexDirection={'row'} sx={{ width: '25%', overflow: 'hidden', cursor: 'pointer', fontSize: '14px' }}>
							<TableHeadAction id='job_opening_count' order={order} orderBy={orderBy} onSort={onSort} title='Jobs' orderType={ORDER_TYPE.NUMBER} />
						</Stack>
						<Stack textAlign={'center'} justifyContent={'flex-end'} alignItems={'center'} flexDirection={'row'} sx={{ width: '10%', overflow: 'hidden', cursor: 'pointer', fontSize: '14px' }}>
							<Typography textAlign={'center'} sx={{ fontSize: '14px', fontWeight: 600, whiteSpace: 'nowrap', textOverflow: 'ellipsis', width: '100%', overflow: 'hidden' }}>
								Edit
							</Typography>
						</Stack>
					</Stack>

					{/* Body */}
					{loading ? (
						<Stack sx={{ minHeight: '400px' }} position={'relative'} justifyContent={'center'} alignItems={'center'}>
							<Loading />
						</Stack>
					) : sortedData.length === 0 ? (
						<Stack justifyContent={'center'} alignItems={'center'}>
							<TableNoData isNotFound={dataNotFound} />
						</Stack>
					) : (
						<Stack sx={{ maxHeight: '325px', overflowY: 'auto' }}>
							{sortedData.map((client, index) => {
								return (
									<Stack
										sx={{ borderBottom: '1px solid #E4E5E7', minHeight: '50px' }}
										key={'client-prescreening-data-' + index}
										gap={1}
										flexDirection={'row'}
										justifyContent={'space-between'}
										px={0.5}
										py={1}
									>
										<Stack onClick={() => handleOpenClientDetails(client, index)} justifyContent={'center'} alignItems={'flex-start'} sx={{ "&:hover": { textDecoration: 'underline', color: '#9859E0', cursor: 'pointer' }, width: '65%', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
											<Typography sx={{ fontSize: '16px', fontWeight: 400, whiteSpace: 'nowrap', textOverflow: 'ellipsis', width: '100%', overflow: 'hidden' }}>
												{client.client_name}
											</Typography>
										</Stack>
										<Stack justifyContent={'center'} alignItems={'flex-start'} sx={{ width: '25%', overflow: 'hidden' }}>
											<Typography textAlign={'center'} sx={{ fontSize: '14px', fontWeight: 400, whiteSpace: 'nowrap', textOverflow: 'ellipsis', width: '100%', overflow: 'hidden' }}>
												{client.job_opening_count}
											</Typography>
										</Stack>
										<MenuButton client={client} index={index} />
									</Stack>
								);
							})}
						</Stack>
					)}
				</Stack>
				<Stack gap={2} flexDirection={'row'} justifyContent={'flex-start'} alignItems={'center'}>
					{
						dataNotFound === false && !loading &&
						<IconButton onClick={() => handleCreateNewClientClick()}>
							<AddCircleOutlineIcon />
						</IconButton>
					}
					{dataNotFound === false && !searchBarVisible && !loading &&
						<IconButton onClick={() => setSearchBarVisible(true)}>
							<SearchIcon sx={{ cursor: 'pointer' }} />
						</IconButton>}
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

export default ClientsList;
