import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Stack, Typography, Box, Alert, Button, TextField, Select, MenuItem, InputLabel } from '@mui/material';
import FormControl from '@mui/material/FormControl';
import { useSnackbar } from 'notistack';

// API
import { API_GET_COUNTRIES, API_GET_STATES, API_GET_CITIES } from 'src/config-global';
import { AIGetAPIRequest, AIPostAPIRequest, setChatContext } from 'src/feature/ai-worker/constants';
import { closeModal } from '../../../../../redux/slices/modal';
import { useDispatch } from 'react-redux';
import { ADD_OR_UPDATE_CLIENT, GET_CLIENT_DETAILS } from '../../../../../config-global';
import { refreshComponent } from '../../../../../redux/slices/refresh';
import { LoadingButton } from '@mui/lab';
import UserFeedback from '../../../../../components/user-feedback/UserFeedback';
import OutputCard from '../OutputCard';

const sectionList = ['CLIENT_NAME', 'LOCATION', 'SALARY', 'DEPARTMENT', 'CLIENT', 'FEES', 'CONTACT', 'NOTES'];

const currencyOptions = [
	{
		name: 'AUD',
		symbol: '$',
	},
	{
		name: 'CAD',
		symbol: '$',
	},
	{
		name: 'CHF',
		symbol: 'CHF',
	},
	{
		name: 'CNY',
		symbol: '¥',
	},
	{
		name: 'EUR',
		symbol: '€',
	},
	{
		name: 'GBP',
		symbol: '£',
	},
	{
		name: 'JPY',
		symbol: '¥',
	},
	{
		name: 'NZD',
		symbol: '$',
	},
	{
		name: 'SEK',
		symbol: 'kr',
	},
	{
		name: 'USD',
		symbol: '$',
	},
];

const EditClientCard = ({ isEditing, jobOpeningDetails, onCloseModal, setRefetchData, onClose, clientDataProp, readOnly, conversationGuid, handleCardClose, ...props }) => {
	const clientData = clientDataProp ? clientDataProp : JSON.parse(window.sessionStorage.getItem('edit-client-value'));
	const { enqueueSnackbar } = useSnackbar();
	const [canCloseCard, setCanCloseCard] = useState(true);
	const [activeSection, setActiveSection] = useState(readOnly ? null : 'CLIENT_NAME');
	const [errorMessage, setErrorMessage] = useState('');
	const [errorSection, setErrorSection] = useState([]);
	const [hovered, setHovered] = useState(false);
	const [clientCompanyName, setClientCompanyName] = useState(clientData?.client_name ? clientData?.client_name : '');
	const [focusInput, setFocusInput] = useState(true);
	const [locationOptions, setLocationOptions] = useState({
		countries: [],
		states: [],
		cities: [],
	});
	const [feesCurrencyVisits, setFeesCurrencyVisits] = useState(0);
	const [clientLocationOptions, setClientLocationOptions] = useState({
		countries: [],
		states: [],
		cities: [],
	});
	const [location, setLocation] = useState({
		city: jobOpeningDetails?.job_opening_location?.city ?? '',
		state: jobOpeningDetails?.job_opening_location?.state ?? '',
		country: jobOpeningDetails?.job_opening_location?.country ?? '',
	});
	const findCurrencySymbol = useMemo(() => {
		return currencyOptions.find((item) => item.name === jobOpeningDetails?.currency_code)?.symbol ?? '$';
	}, [jobOpeningDetails]);
	// const [department, setDepartment] = useState({
	//     existingDepartment: '',
	//     newDepartment: '',
	//     enableNewDepartment: false,
	// });
	const [fees, setFees] = useState({
		currencySymbol: findCurrencySymbol ?? '$',
		currency: jobOpeningDetails?.currency_code ?? 'USD',
		amount: jobOpeningDetails?.agency_commision_fee_value ? `${jobOpeningDetails?.agency_commision_fee_value}` : '',
		percentage: jobOpeningDetails?.agency_commision_fee_percent ? `${jobOpeningDetails?.agency_commision_fee_percent}` : '',
	});
	const [contact, setContact] = useState({
		name: clientData?.contact ? clientData?.contact : '',
		email: clientData?.client_email ? clientData?.client_email : '',
		phone: clientData?.client_phone ? clientData?.client_phone : '',
	});
	const [notes, setNotes] = useState(jobOpeningDetails?.summary ?? '');
	const [savedData, setSavedData] = useState({
		clientCompanyName: clientData?.client_name ? clientData?.client_name : '',
		location: {
			city: '',
			state: '',
			country: '',
		},
		department: {
			existingDepartment: '',
			newDepartment: '',
			enableNewDepartment: false,
		},
		fees: {
			currencySymbol: '$',
			currency: 'USD',
			amount: '',
			percentage: '',
		},
		contact: {
			name: clientData?.contact ? clientData?.contact : '',
			email: clientData?.client_email ? clientData?.client_email : '',
			phone: clientData?.client_phone ? clientData?.client_phone : '',
		},
		notes: '',
	});
	const [unsavedDataExists, setUnsavedDataExists] = useState(false);
	const [loading, setLoading] = useState(false);
	const savedDataCount = useRef(0);
	const dispatch = useDispatch();
	const formRenderCount = useRef(0);

	const fetchCountriesData = async (country_id, state_id, city_id) => {
		const data = await AIGetAPIRequest(API_GET_COUNTRIES);
		if (clientData?.country_id || country_id) {
			// console.log('Client Data is >>> ', clientData, country_id, state_id, city_id);
			let country = data.find((item) => (clientData?.country_id ? item.id === clientData?.country_id : item.id === country_id));
			let statesData = await AIGetAPIRequest(`${API_GET_STATES}?country_id=${clientData.country_id || country_id}`);
			let state = statesData.find((item) => (clientData?.state_id ? item.id === clientData?.state_id : item.id === state_id));
			let city,
				citiesData = '';
			if (state) {
				citiesData = await AIGetAPIRequest(`${API_GET_CITIES}?state_id=${clientData.state_id || state_id}`);
				city = citiesData.find((item) => (clientData?.city_id ? item.id === clientData?.city_id : item.id === city_id));
			}
			// console.log('Successfully set location data ', country, state, city);
			setLocation((prevState) => ({ ...prevState, country: country, state: state, city: city }));
			setSavedData((prevState) => ({ ...prevState, location: { ...prevState.location, country: country, state: state, city: city } }));
		}
		setLocationOptions((prevState) => ({ ...prevState, countries: data }));
		setClientLocationOptions((prevState) => ({ ...prevState, countries: data }));
		return data;
	};

	const fetchStatesData = async (type, id) => {
		const data = await AIGetAPIRequest(`${API_GET_STATES}?country_id=${id ? id : type === 'location' ? location.country.id : client.clientLocation.country.id}`);
		// const data = await response.json();
		// console.log('States data is >>> ', data)
		if (type === 'location') {
			setLocationOptions((prevState) => ({ ...prevState, states: data }));
		} else {
			setClientLocationOptions((prevState) => ({ ...prevState, states: data }));
		}
	};

	const fetchCitiesData = async (type, id) => {
		const data = await AIGetAPIRequest(`${API_GET_CITIES}?state_id=${id ? id : type === 'location' ? location.state.id : client.clientLocation.state.id}`);
		// const data = await response.json();
		// console.log('Cities data is >>> ', data)
		if (type === 'location') {
			setLocationOptions((prevState) => ({ ...prevState, cities: data }));
		} else {
			setClientLocationOptions((prevState) => ({ ...prevState, cities: data }));
		}
	};

	const handleClientStateAndCity = async (country_id, state_id) => {
		let statesData, citiesData;
		statesData = await AIGetAPIRequest(`${API_GET_STATES}?country_id=${country_id}`);

		if (state_id) {
			citiesData = await AIGetAPIRequest(`${API_GET_CITIES}?state_id=${state_id}`);
		}

		return { statesData, citiesData };
	};

	const validateJobOpeningFormData = async () => {
		// Check Job Title
		if (clientCompanyName.trim() === '') {
			setActiveSection('CLIENT_NAME');
			setFocusInput(true);
			// setErrorSection('CLIENT_NAME');
			if (!errorSection.includes('CLIENT_NAME')) {
				setErrorSection([...errorSection, 'CLIENT_NAME']);
			}
			setErrorMessage('Client company name cannot be empty.');
			return;
		}
		// If everything is okay, and no errors are thrown
		setErrorMessage('');
		// setErrorSection('')
		setErrorSection(['']);
		setActiveSection('');
		await submitClientForm();
		return;
	};

	const validateFormOnSectionChange = () => {
		let errorSectionArray = errorSection;
		if (clientCompanyName.trim() === '') {
			if (!errorSectionArray.includes('CLIENT_NAME')) {
				errorSectionArray.push('CLIENT_NAME');
			}
		}

		setErrorSection(errorSectionArray);
		return;
	};

	const handleCancelClick = () => {
		if (!unsavedDataExists) {
			dispatch(closeModal());
			return;
		}
		setClientCompanyName(savedData.clientCompanyName);
		setLocation(savedData.location);
		setContact({ ...savedData.contact });
		setNotes(savedData.notes);
		setActiveSection('');
		setErrorSection([]);
		setErrorMessage('');
		savedDataCount.current = 0;
	};

	const submitClientForm = async (data) => {
		setLoading(true);
		const toSubmit = {
			client_id: clientDataProp ? clientDataProp : clientData?.client_id ? clientData?.client_id : '',
			client_name: clientCompanyName,
			// client_department: department.existingDepartment || department.newDepartment,
			client_email: contact.email,
			client_phone: contact.phone?.toString(),
			country_name: location.country ? location.country : {},
			state_name: location.state ? location.state : {},
			city_name: location.city ? location.city : {},
			contact: contact,
			agency_commission_fee_value: fees.amount,
			agency_commission_fee_pct: fees.percentage,
			currency_code: fees.currency,
			notes: notes,
		};
		try {
			await AIPostAPIRequest(ADD_OR_UPDATE_CLIENT, toSubmit)
				.then((response) => {
					if (response.message === 'Success') {
						// console.log('Response Message is 1 >>> ', response.message)
						savedDataCount.current += 1;
						setUnsavedDataExists(false);
						// console.log('Response Message is 2 >>> ', response.message)
						setSavedData((prevState) => ({
							...prevState,
							clientCompanyName: clientCompanyName,
							location: location,
							// department: department,
							fees: fees,
							contact: contact,
							notes: notes,
						}));
						// console.log('Response Message is 3 >>> ', response.message)
						enqueueSnackbar('Client processed!');
						setLoading(false);
						dispatch(refreshComponent({ component: 'CLIENT_LIST' }));
						dispatch(closeModal());
					}
				})
				.catch((error) => {
					setLoading(false);
					// console.log('API Save Error is > ', error)
				});
		} catch (error) {
			setLoading(false);
			await enqueueSnackbar('Error processing client', { variant: 'error' });
		}

		handleSetContext(toSubmit);
	};

	const checkIfUnsavedDataExists = () => {
		// if (!readOnly) {
		if (clientCompanyName !== savedData.clientCompanyName) {
			setUnsavedDataExists(true);
			setCanCloseCard(false);
			console.log('Job title is not equal to saved data.');
			return;
		}
		// if (readOnly) {
		//     if (location.city.name !== savedData.location.city) {
		//         setUnsavedDataExists(true);
		//         setCanCloseCard(false);
		//         console.log('Location city is not equal to saved data.', location.city, savedData.location);
		//         return;
		//     }
		//     if (location.state.name !== savedData.location.state) {
		//         setUnsavedDataExists(true);
		//         setCanCloseCard(false);
		//         console.log('Location city is not equal to saved data.', location.city, savedData.location);
		//         return;
		//     }
		//     if (location.country.name !== savedData.location.country) {
		//         setUnsavedDataExists(true);
		//         setCanCloseCard(false);
		//         console.log('Location city is not equal to saved data.', location.city, savedData.location);
		//         return;
		//     }
		// } else {
		if (location.city !== savedData?.location?.city) {
			setUnsavedDataExists(true);
			setCanCloseCard(false);
			console.log('Location city is not equal to saved data.', location, savedData.location);
			return;
		}
		if (location.state !== savedData?.location?.state) {
			setUnsavedDataExists(true);
			setCanCloseCard(false);
			console.log('Location state is not equal to saved data.', location, savedData.location);
			return;
		}
		if (location.country !== savedData?.location?.country) {
			setUnsavedDataExists(true);
			setCanCloseCard(false);
			console.log('Location country is not equal to saved data.', location, savedData.location);
			return;
		}
		// }
		if (fees.currency !== savedData.fees.currency) {
			setUnsavedDataExists(true);
			setCanCloseCard(false);
			console.log('Fees currency is not equal to saved data.');
			return;
		}
		if (fees.amount !== savedData.fees.amount) {
			setUnsavedDataExists(true);
			setCanCloseCard(false);
			console.log('Fees amount is not equal to saved data.');
			return;
		}
		if (fees.percentage !== savedData.fees.percentage) {
			setUnsavedDataExists(true);
			setCanCloseCard(false);
			console.log('Fees percentage is not equal to saved data.');
			return;
		}
		if (contact.name !== savedData.contact.name) {
			setUnsavedDataExists(true);
			setCanCloseCard(false);
			console.log('Contact name is not equal to saved data.');
			return;
		}
		if (contact.email !== savedData.contact.email) {
			setUnsavedDataExists(true);
			setCanCloseCard(false);
			console.log('Contact email is not equal to saved data.');
			return;
		}
		if (contact.phone !== savedData.contact.phone) {
			setUnsavedDataExists(true);
			setCanCloseCard(false);
			console.log('Contact phone is not equal to saved data.');
			return;
		}
		if (notes !== savedData.notes) {
			setUnsavedDataExists(true);
			setCanCloseCard(false);
			console.log('Notes is not equal to saved data.');
			return;
		}
		setCanCloseCard(true);
		setUnsavedDataExists(false);
		// }
		return;
	};

	const handleActiveSectionChangeOnTabPress = (e) => {
		if (e.keyCode === 9) {
			// e.stopPropagation()
			// e.preventDefault();
			// console.log('TAB KEY PRESSED', sectionList.indexOf(activeSection), activeSection);
		}
	};

	const handleSetContext = async (client) => {
		const body = {
			conversation_id: conversationGuid,
			event_id: props.id,
			payload: {
				client,
			},
			category: 'CLIENT_DETAILS',
		};
		try {
			const response = await setChatContext(body);
		} catch (err) {
			console.error(err);
		}
	};

	// const showPosition = (coordinates) => {
	//     console.log('Coordinates are >>> ', coordinates)
	// }

	// const getLocation = (e) => {
	//     if (navigator.geolocation) {
	//         navigator.geolocation.getCurrentPosition(showPosition);
	//     } else {
	//         // x.innerHTML = "Geolocation is not supported by this browser.";
	//         console.log('User is not granting permission for location.')
	//     }
	// }

	const fetchClientDetails = async (clientId) => {
		const response = await AIGetAPIRequest(GET_CLIENT_DETAILS + `/?client_id=${clientId}`);
		// console.log('Client details response is >>> ', response);
		setClientCompanyName(response?.client_name ? response?.client_name : '');
		// setLocation(
		//     {
		//         city: { name: response?.city && response?.city !== 'UNKNOWN' ? response?.city : '' },
		//         state: { name: response?.state && response?.state !== 'UNKNOWN' ? response?.state : '' },
		//         country: { name: response?.country && response?.country !== 'UNKNOWN' ? response?.country : '' },
		//     }
		// )
		setFees({
			currencySymbol: '$',
			currency: response?.currency_code ? response?.currency_code : 'USD',
			amount: response?.agency_commision_fee_value ? response?.agency_commision_fee_value : '',
			percentage: response?.agency_commision_fee_percentage ? response?.agency_commision_fee_percentage : '',
		});
		setContact({
			name: response?.contact ? response?.contact : '',
			email: response?.client_email ? response?.client_email : '',
			phone: response?.client_phone ? response?.client_phone : '',
		});
		setNotes(response?.notes ? response?.notes : '');
		setSavedData({
			...savedData,
			clientCompanyName: response?.client_name ? response?.client_name : '',
			// location: {
			//     city: response?.city && response?.city !== 'UNKNOWN' ? response?.city : '',
			//     state: response?.state && response?.state !== 'UNKNOWN' ? response?.state : '',
			//     country: response?.country && response?.country !== 'UNKNOWN' ? response?.country : '',
			// },
			department: {
				existingDepartment: '',
				newDepartment: '',
				enableNewDepartment: false,
			},
			fees: {
				currencySymbol: '$',
				currency: response?.currency_code ? response?.currency_code : 'USD',
				amount: response?.agency_commision_fee_value ? response?.agency_commision_fee_value : '',
				percentage: response?.agency_commision_fee_percentage ? response?.agency_commision_fee_percentage : '',
			},
			contact: {
				name: response?.contact ? response?.contact : '',
				email: response?.client_email ? response?.client_email : '',
				phone: response?.client_phone ? response?.client_phone : '',
			},
			notes: response?.notes ? response.notes : '',
		});
		fetchCountriesData(response?.country_id, response?.state_id, response?.city_id);
	};

	useEffect(() => {
		if (readOnly && clientDataProp) {
			// console.log('Need to call client details API here to fill the card up');
			fetchClientDetails(clientDataProp);
		} else {
			fetchClientDetails(clientData?.client_id);
			fetchCountriesData();
		}
		// console.log('Client data in edit client card is >>> ', clientData);
	}, []);

	useEffect(() => {
		if (location.country !== 'UNKNOWN' && location.country) {
			fetchStatesData('location');
		}
	}, [location.country]);

	useEffect(() => {
		if (location.state !== 'UNKNOWN' && location.state) {
			fetchCitiesData('location');
		}
	}, [location.state]);

	useEffect(() => {
		if (activeSection) {
			validateFormOnSectionChange();
		}
	}, [activeSection]);

	useEffect(() => {
		// Need to compare if data is not equal to saved data, then show the save button.
		// Compare all the data within the objects individually.
		checkIfUnsavedDataExists();
	}, [
		clientCompanyName,
		location.city,
		location.state,
		location.country,
		// department.existingDepartment,
		// department.newDepartment,
		// department.enableNewDepartment,
		fees.currency,
		fees.amount,
		fees.percentage,
		contact.name,
		contact.email,
		contact.phone,
		notes,
	]);

	return (
		<OutputCard showClose={!readOnly} title={'Client'} isATSCard closeCard={() => { handleCardClose(props) }}>
			<Stack onKeyDown={(e) => handleActiveSectionChangeOnTabPress(e)} gap={3} width={{ xs: '100%', md: '90%' }} minWidth={{ xs: '100%', md: '600px' }} flexDirection={'column'} sx={{ backgroundColor: 'white', borderRadius: 2, maxWidth: '650px' }}>
				<CreateClientName
					setHovered={setHovered}
					hovered={hovered}
					setErrorMessage={setErrorMessage}
					setErrorSection={setErrorSection}
					errorSection={errorSection}
					focusInput={focusInput}
					clientCompanyName={clientCompanyName}
					setClientCompanyName={setClientCompanyName}
					setActiveSection={setActiveSection}
					activeSection={activeSection === 'CLIENT_NAME'}
				/>
				<CreateLocationSection setHovered={setHovered} hovered={hovered} errorSection={errorSection} locationOptions={locationOptions} location={location} setLocation={setLocation} setActiveSection={setActiveSection} activeSection={activeSection === 'LOCATION'} />
				<CreateContactSection setHovered={setHovered} hovered={hovered} errorSection={errorSection} contact={contact} setContact={setContact} setActiveSection={setActiveSection} activeSection={activeSection === 'CONTACT'} />
				<CreateFeesSection
					setHovered={setHovered}
					feesCurrencyVisits={feesCurrencyVisits}
					setFeesCurrencyVisits={setFeesCurrencyVisits}
					hovered={hovered}
					errorSection={errorSection}
					currencyOptions={currencyOptions}
					fees={fees}
					setFees={setFees}
					setActiveSection={setActiveSection}
					activeSection={activeSection === 'FEES'}
				/>
				<CreateNotesSection setHovered={setHovered} hovered={hovered} errorSection={errorSection} notes={notes} setNotes={setNotes} setActiveSection={setActiveSection} activeSection={activeSection === 'NOTES'} />
				{errorMessage !== '' ? <Alert severity='error'>{errorMessage}</Alert> : null}
				<JobCardControls
					loading={loading}
					canCloseCard={canCloseCard}
					unsavedDataExists={unsavedDataExists}
					savedDataCount={savedDataCount}
					handleCancelClick={handleCancelClick}
					validateJobOpeningFormData={validateJobOpeningFormData}
					activeSection={activeSection}
					setActiveSection={setActiveSection}
					onCloseModal={onCloseModal}
					readOnly={readOnly}
				/>
			</Stack>
		</OutputCard>
	);
};

const JobCardHeader = () => {
	return (
		<Stack flexDirection={'row'} alignItems={'center'} gap={2}>
			<img src={'/assets/icons/components/job-opening-icon.svg'}></img>
			<Typography color={'#170058'} variant={'subtitle1'} fontWeight={400}>
				Client
			</Typography>
		</Stack>
	);
};

const JobCardControls = ({ setActiveSection, activeSection, validateJobOpeningFormData, handleCancelClick, savedDataCount, unsavedDataExists, canCloseCard, onCloseModal, loading, readOnly }) => {
	return (
		<Stack flexDirection={'row'} justifyContent={'space-between'} alignItems={'center'}>
			<Box>{/* <img src={'/assets/icons/components/upload_icon.svg'}></img> */}</Box>
			<Stack flexDirection={'row'} gap={1} justifyContent={'flex-end'} alignItems={'center'}>
				{
					// savedDataCount.current > 0
					// ?
					// unsavedDataExists || canCloseCard ? (
					!readOnly || unsavedDataExists ? (
						<Button
							onClick={() => {
								onCloseModal ? onCloseModal() : handleCancelClick();
							}}
							sx={{ backgroundColor: 'white' }}
							variant={'outlined'}
						>
							Cancel
						</Button>
					) : null
					// ) : null
				}
				{unsavedDataExists ? (
					<LoadingButton
						loading={loading}
						onClick={() => {
							validateJobOpeningFormData();
						}}
						sx={{ backgroundColor: '#170058' }}
						variant={'contained'}
					>
						Save
					</LoadingButton>
				) : null}
				<UserFeedback />
			</Stack>
		</Stack>
	);
};

const CreateClientName = ({ setErrorSection, setErrorMessage, activeSection, clientCompanyName, setClientCompanyName, setActiveSection, focusInput, errorSection, setHovered, hovered }) => {
	const handleJobTitle = (e) => {
		const clientCompanyName = e.target.value;
		if (clientCompanyName !== null) {
			setErrorMessage('');
			// let errorSectionArray = errorSection;
			setClientCompanyName(clientCompanyName);
		}
	};

	let label = 'CLIENT_NAME';

	return (
		<Stack onClick={() => setActiveSection('CLIENT_NAME')} onMouseOver={() => setHovered(label)} onMouseLeave={() => setHovered(false)} flexDirection={'row'} sx={{ minWidth: '400px', width: '100%', cursor: 'pointer' }} justifyContent={'space-between'} alignItems={'center'} gap={1}>
			{!activeSection && clientCompanyName === '' ? (
				<Stack gap={2} width={'100%'} onClick={() => setActiveSection('CLIENT_NAME')} sx={{ cursor: 'pointer' }} flexDirection={'row'} justifyContent={'flex-start'} alignItems={'center'}>
					<SectionHeading hovered={hovered === label} activeSection={activeSection} errorSection={errorSection.includes('CLIENT_NAME')} headingName={'Company name&#42;'} />
					{hovered === label ? <EditIcon setActiveSection={setActiveSection} label='CLIENT_NAME' /> : null}
				</Stack>
			) : activeSection ? (
				<TextField autoComplete='off' autoFocus={true} value={clientCompanyName} fullWidth onChange={(e) => handleJobTitle(e)} variant={'outlined'} label={'Company name'} placeholder='Type client or company name' />
			) : !activeSection && clientCompanyName !== '' ? (
				<Stack width={'100%'} flexDirection={'row'} alignItems={'center'} justifyContent={'flex-start'} gap={2}>
					<Typography sx={{ color: hovered === label ? '#9859E0' : '#21054C' }} hovered={hovered === label} fontWeight={700} fontSize={'22px'}>
						{clientCompanyName}
					</Typography>
					{hovered === label ? <EditIcon setActiveSection={setActiveSection} label='CLIENT_NAME' /> : null}
					{/* <EditIcon setActiveSection={setActiveSection} label="CLIENT_NAME" /> */}
				</Stack>
			) : null}
		</Stack>
	);
};

const getObjectById = (id, list) => {
	const object = list?.find((item) => item.id === id);
	return object;
};

const CreateLocationSection = ({ activeSection, setActiveSection, setLocation, location, locationOptions, setHovered, hovered }) => {
	let label = 'LOCATION';

	const handleCountryChange = (event) => {
		const target = getObjectById(event.target.value, locationOptions?.countries ?? []);
		setLocation((prevState) => ({ ...prevState, country: target ?? '' }));
	};

	const handleCityChange = (event) => {
		const target = getObjectById(event.target.value, locationOptions?.cities ?? []);
		setLocation((prevState) => ({ ...prevState, city: target ?? '' }));
	};

	const handleStateChange = (event) => {
		const target = getObjectById(event.target.value, locationOptions?.states ?? []);
		setLocation((prevState) => ({ ...prevState, state: target ?? '' }));
	};

	return (
		<Stack onMouseOver={() => setHovered(label)} onMouseLeave={() => setHovered(false)} sx={{ width: '100%', cursor: 'pointer' }} flexDirection={'row'} alignItems={'center'} gap={2} onClick={() => setActiveSection('LOCATION')}>
			<SectionHeading hovered={hovered === label} activeSection={activeSection} headingName={'Location'} />
			{activeSection ? (
				<Stack width={'100%'} gap={1} flexDirection={'row'} alignItems={'center'} justifyContent={'space-between'}>
					<FormControl sx={{ flex: 1 }}>
						<InputLabel>Country</InputLabel>
						<Select
							// sx={{ width: 125 }}
							value={location?.country?.id}
							label='Country'
							onChange={handleCountryChange}
						>
							{locationOptions.countries.map((country, index) => {
								return (
									<MenuItem key={index} value={country?.id}>
										{country.name}
									</MenuItem>
								);
							})}
						</Select>
					</FormControl>
					{locationOptions.states.length > 0 ? (
						<FormControl sx={{ flex: 1 }}>
							<InputLabel>State</InputLabel>
							<Select
								// sx={{ width: 125 }}
								value={location?.state?.id}
								label='State'
								onChange={handleStateChange}
							>
								{locationOptions.states.map((state, index) => {
									return (
										<MenuItem key={index} value={state?.id}>
											{state.name}
										</MenuItem>
									);
								})}
							</Select>
						</FormControl>
					) : null}
					{locationOptions.cities.length > 0 ? (
						<FormControl sx={{ flex: 1 }}>
							<InputLabel>City</InputLabel>
							<Select
								// sx={{ width: 125 }}
								value={location.city?.id}
								label='City'
								onChange={handleCityChange}
							>
								{locationOptions.cities.map((city, index) => {
									return (
										<MenuItem key={index} value={city?.id}>
											{city.name}
										</MenuItem>
									);
								})}
							</Select>
						</FormControl>
					) : null}
				</Stack>
			) : (
				<Stack sx={{ width: '100%' }} flexDirection={'row'} justifyContent={'flex-start'} gap={2} alignItems={'center'}>
					{location.country || location.state || location.city ? (
						<Typography variant='body1'>
							{location.country?.name && !location.state?.name && !location.city?.name
								? `${location.country?.name}`
								: location.country?.name && location.state?.name && !location.city?.name
									? `${location.country?.name}, ${location.state?.name}`
									: location.country?.name && location.state?.name && location.city?.name
										? `${location.country?.name}, ${location.state?.name}, ${location.city?.name}`
										: null}
						</Typography>
					) : // <div></div>
					null}
					{hovered === label ? <EditIcon setActiveSection={setActiveSection} label='LOCATION' /> : null}
					{/* <EditIcon setActiveSection={setActiveSection} label="LOCATION" /> */}
				</Stack>
			)}
		</Stack>
	);
};

const CreateDepartmentSection = ({ activeSection, setActiveSection, department, setDepartment }) => {
	let label = 'DEPARTMENT';

	const handleExistingDepartmentChange = (event) => {
		// console.log('new department is >>> ', event.target.value);
	};

	return (
		<Stack gap={2} sx={{ width: '100%', cursor: 'pointer' }} flexDirection={'row'} alignItems={'center'} onClick={() => setActiveSection('DEPARTMENT')}>
			<SectionHeading hovered={hovered === label} activeSection={activeSection} headingName={'Department'} />
			{activeSection ? (
				<Stack width={'100%'} flexDirection={'column'} justifyContent={'center'} gap={1}>
					<Stack width={'100%'} flexDirection={'row'} alignItems={'center'} gap={1}>
						<FormControl sx={{ flex: 1 }}>
							<InputLabel>Department</InputLabel>
							<Select
								// sx={{ width: 125 }}
								value={department.existingDepartment}
								label='Pick Department'
								onChange={handleExistingDepartmentChange}
							>
								<MenuItem value={'React Department'}>React Department</MenuItem>
							</Select>
						</FormControl>
						<Typography sx={{}} variant='body1'>
							OR
						</Typography>
						<Button onClick={() => setDepartment({ ...department, enableNewDepartment: true })} sx={{ backgroundColor: '#170058', color: 'white', whiteSpace: 'nowrap', flex: 1, fontSize: '14px' }} variant='contained'>
							Create new department
							<img width={16} src={'/assets/icons/components/white-plus.svg'}></img>
						</Button>
					</Stack>
					{department.enableNewDepartment ? (
						<Stack width={'100%'} flexDirection={'row'} alignItems={'center'}>
							<TextField autoFocus={true} autoComplete='off' value={department.newDepartmentName} onChange={(e) => setDepartment({ ...department, newDepartment: e.target.value })} sx={{ flex: 1 }} variant={'outlined'} label={'Department'} placeholder='Type department name...' />
						</Stack>
					) : null}
				</Stack>
			) : (
				<Stack flexDirection={'row'} alignItems={'center'} gap={2}>
					<Typography variant='body1'>React Department</Typography>
					<EditIcon setActiveSection={setActiveSection} label={'DEPARTMENT'} />
				</Stack>
			)}
		</Stack>
	);
};

const CreateFeesSection = ({ activeSection, setActiveSection, fees, setFees, currencyOptions, setHovered, hovered, feesCurrencyVisits, setFeesCurrencyVisits }) => {
	let label = 'FEES';

	const handleFeesCurrencyChange = (event) => {
		let currencySymbol = currencyOptions.find((currency) => currency.name === event.target.value);
		setFees({ ...fees, currency: event.target.value, currencySymbol: currencySymbol.symbol });
	};

	const handleFeesAmountChange = (event) => {
		let inputValue = event.target.value;
		// Remove non-numeric characters and disallow 'E'
		inputValue = inputValue.replace(/[^0-9.]/g, '').replace(/(\..*)\./g, '$1');
		// Remove leading zeros
		inputValue = inputValue.replace(/^0+/g, '');
		// Ensure that the input is not empty
		if (inputValue === '') {
			inputValue = ''; // or you can set it to an empty string based on your requirement
		}
		// Update the input value
		event.target.value = inputValue;
		setFees({ ...fees, amount: event.target.value });
	};

	const handleFeesPercentageChange = (event) => {
		let inputValue = event.target.value;
		// Remove non-numeric characters and disallow 'E'
		inputValue = inputValue.replace(/[^0-9.]/g, '').replace(/(\..*)\./g, '$1');
		// Remove leading zeros
		inputValue = inputValue.replace(/^0+/g, '');
		// Ensure that the input is not empty
		if (inputValue === '') {
			inputValue = ''; // or you can set it to an empty string based on your requirement
		}
		// Update the input value
		event.target.value = inputValue;
		setFees({ ...fees, percentage: event.target.value });
	};

	return (
		<Stack onMouseOver={() => setHovered(label)} onMouseLeave={() => setHovered(false)} sx={{ width: '100%', cursor: 'pointer' }} gap={2} width={'100%'} flexDirection={'row'} alignItems={'center'} onClick={() => setActiveSection('FEES')}>
			<SectionHeading hovered={hovered === label} activeSection={activeSection} headingName={'Fees'} />
			{activeSection ? (
				<Stack flexDirection={'row'} alignItems={'center'} gap={1}>
					<Stack sx={{ flex: 1 }} flexDirection={'row'} alignItems={'center'} gap={1}>
						<FormControl sx={{ flex: 1 }}>
							<InputLabel>Currency</InputLabel>
							<Select
								// sx={{ width: 125 }}
								value={fees.currency}
								label='Currency'
								onChange={handleFeesCurrencyChange}
							>
								{currencyOptions.map((currency, index) => {
									return (
										<MenuItem key={index} value={currency.name}>
											{currency.name}
										</MenuItem>
									);
								})}
							</Select>
						</FormControl>
						<TextField autoFocus={true} autoComplete='off' type={'number'} value={fees.amount} onChange={(e) => handleFeesAmountChange(e)} sx={{ flex: 1 }} variant={'outlined'} label={'Agency fee'} placeholder='Enter amount' />
					</Stack>
					<Typography variant='body1'>OR</Typography>
					<TextField autoComplete='off' type={'number'} value={fees.percentage} onChange={(e) => handleFeesPercentageChange(e)} sx={{ flex: 0.5 }} variant={'outlined'} label={'Agency %'} placeholder='Percentage' />
				</Stack>
			) : (
				<Stack width={'100%'} justifyContent={'flex-start'} flexDirection={'row'} alignItems={'center'} gap={2}>
					<Typography variant='body1'>
						{/* I want to generate it in such a format --> 'Amount Value - $1000 / Agency Percentage - 50%'  */}
						{fees.currency
							? fees.amount && !fees.percentage
								? 'Agency fee: ' + fees.currencySymbol + fees.amount + ' ' + fees.currency
								: !fees.amount && fees.percentage
									? 'Agency percentage: ' + fees.percentage + '%'
									: fees.amount && fees.percentage
										? 'Agency fees: ' + fees.currencySymbol + fees.amount + ' ' + fees.currency + ' + ' + fees.percentage + '%'
										: null
							: null}
					</Typography>
					{hovered === label ? <EditIcon setActiveSection={setActiveSection} label={'FEES'} /> : null}
					{/* <EditIcon setActiveSection={setActiveSection} label={'FEES'} /> */}
				</Stack>
			)}
		</Stack>
	);
};

const CreateContactSection = ({ activeSection, contact, setContact, setActiveSection, setHovered, hovered }) => {
	let label = 'CONTACT';

	const handlePhoneNumber = (e) => {
		const value = e.target.value;

		// Regex pattern to allow only numbers, symbols, and brackets
		const numericSymbolRegex = /^[0-9!@#$%^&*()_+{}[\]:;<>,?~\\/\-\s]+$/;

		if (numericSymbolRegex.test(value) || value === '') {
			// If the input is valid, update the state
			setContact({ ...contact, phone: value });
		}
	};

	return (
		<Stack onMouseOver={() => setHovered(label)} onMouseLeave={() => setHovered(false)} gap={2} width={'100%'} flexDirection={'row'} justifyContent={'flex-start'} alignItems={'center'} onClick={() => setActiveSection('CONTACT')}>
			<SectionHeading hovered={hovered === label} activeSection={activeSection} headingName={'Contact'} />
			{
				activeSection ? (
					<Stack flexDirection={'row'} gap={1} alignItems={'center'}>
						<TextField autoFocus={true} autoComplete='off' onChange={(e) => setContact({ ...contact, name: e.target.value })} value={contact.name} fullWidth variant={'outlined'} label={'Name'} placeholder='Full name' />
						<TextField autoComplete='off' onChange={(e) => setContact({ ...contact, email: e.target.value })} value={contact.email} fullWidth variant={'outlined'} label={'Email'} placeholder='Email address' />
						<TextField autoComplete='off' onChange={(e) => handlePhoneNumber(e)} value={contact.phone} fullWidth variant={'outlined'} label={'Phone'} placeholder='Phone number' />
					</Stack>
				) : contact.name || contact.email || contact.phone ? (
					<Stack sx={{ width: '100%' }} flexDirection={'row'} alignItems={'center'} justifyContent={'flex-start'} gap={1}>
						{contact.name && contact.email && contact.phone ? (
							<Typography variant='body1'>
								{contact.name} {'<' + contact.email + '>'} <br></br> {contact.phone}
							</Typography>
						) : // <div></div>
						null}
						{contact.name && contact.email && !contact.phone ? (
							<Typography variant='body1'>
								{contact.name} {'<' + contact.email + '>'}
							</Typography>
						) : // <div></div>
						null}
						{contact.name && !contact.email && contact.phone ? (
							<Typography variant='body1'>
								{contact.name} {contact.phone}
							</Typography>
						) : // <div></div>
						null}
						{!contact.name && contact.email && contact.phone ? (
							<Typography variant='body1'>
								{'<' + contact.email + '>'}, {contact.phone}
							</Typography>
						) : // <div></div>
						null}
						{contact.name && !contact.email && !contact.phone ? (
							<Typography variant='body1'>{contact.name}</Typography>
						) : // <div></div>
						null}
						{!contact.name && contact.email && !contact.phone ? (
							<Typography variant='body1'>{'<' + contact.email + '>'}</Typography>
						) : // <div></div>
						null}
						{!contact.name && !contact.email && contact.phone ? (
							<Typography variant='body1'>{contact.phone}</Typography>
						) : // <div></div>
						null}
						{!contact.name && !contact.email && !contact.phone ? (
							<Typography variant='body1'>No contact details added.</Typography>
						) : // <div></div>
						null}
						{/* <EditIcon setActiveSection={setActiveSection} label={'CONTACT'} /> */}
					</Stack>
				) : null
				// <EditIcon setActiveSection={setActiveSection} label={'CONTACT'} />
			}
			{hovered === label && !activeSection ? <EditIcon setActiveSection={setActiveSection} label={'CONTACT'} /> : null}
			{/* <EditIcon setActiveSection={setActiveSection} label={'CONTACT'} /> */}
		</Stack>
	);
};

const CreateNotesSection = ({ activeSection, notes, setNotes, setActiveSection, setHovered, hovered }) => {
	let label = 'NOTES';
	return (
		<Stack sx={{ cursor: 'pointer' }} onMouseOver={() => setHovered(label)} onMouseLeave={() => setHovered(false)} gap={2} width={'100%'} flexDirection={'row'} alignItems={'flex-start'} onClick={() => setActiveSection('NOTES')}>
			<SectionHeading hovered={hovered === label} activeSection={activeSection} headingName={'Notes'} />
			{activeSection ? (
				<TextField autoFocus={true} autoComplete='off' value={notes} onChange={(e) => setNotes(e.target.value)} fullWidth multiline rows={4} variant={'outlined'} label={'Notes'} placeholder='Optional' />
			) : !activeSection ? (
				<Stack width={'100%'} flexDirection={'row'} alignItems={'center'} justifyContent={'flex-start'} gap={1}>
					<Typography variant='body1'>{notes}</Typography>
					{hovered === label ? <EditIcon setActiveSection={setActiveSection} label={'NOTES'} /> : null}
				</Stack>
			) : null}
		</Stack>
	);
};

const SectionHeading = ({ headingName, activeSection, hovered, errorSection }) => {
	return (
		<Box minWidth={'20%'} sx={{ cursor: 'pointer' }}>
			<Typography fontWeight={600} fontSize={'16px'} sx={{ color: errorSection ? 'red' : activeSection || hovered ? '#9859E0' : '#21054C' }} dangerouslySetInnerHTML={{ __html: headingName }}>
				{/* {headingName} */}
			</Typography>
		</Box>
	);
};

const EditIcon = ({ setActiveSection, label }) => {
	return (
		// hovered ?
		<img onClick={() => setActiveSection(label)} width={'18px'} src={'/assets/icons/components/edit-pencil.svg'}></img>
		// :
		// null
	);
};

export default EditClientCard;
