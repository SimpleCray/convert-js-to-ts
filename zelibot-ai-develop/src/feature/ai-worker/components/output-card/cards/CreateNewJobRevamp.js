import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Stack, Typography, Box, Alert, Button, TextField, Select, MenuItem, InputLabel } from '@mui/material';
import FormControl from '@mui/material/FormControl';
import { useSnackbar } from 'notistack';

// API
import { API_GET_CLIENTS, API_UPDATE_CLIENTS, API_GET_COUNTRIES, API_GET_STATES, API_GET_CITIES } from 'src/config-global';
import { AIGetAPIRequest, AIPostAPIRequest, setChatContext } from 'src/feature/ai-worker/constants';
import { useEditJobOpening } from 'src/hooks/JobOpenings/useJobOpening';
import { LoadingButton } from '@mui/lab';
import UserFeedback from '../../../../../components/user-feedback/UserFeedback';
import OutputCard from '../OutputCard';

const sectionList = ['JOB_TITLE', 'LOCATION', 'SALARY', 'DEPARTMENT', 'CLIENT', 'FEES', 'CONTACT', 'NOTES'];

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

const CreateNewJobRevamp = ({ isEditing, jobOpeningDetails, onCloseModal, setRefetchData, event_id, type, handleCardClose, conversationGuid, ...props }) => {
	const { enqueueSnackbar } = useSnackbar();
	const [jobCardVisibility, setJobCardVisibility] = useState('flex');
	const [canCloseCard, setCanCloseCard] = useState(true);
	const [activeSection, setActiveSection] = useState('JOB_TITLE');
	const [errorMessage, setErrorMessage] = useState('');
	const [errorSection, setErrorSection] = useState([]);
	const [hovered, setHovered] = useState(false);
	const [jobTitle, setJobTitle] = useState(jobOpeningDetails?.job_title ?? '');
	const [focusInput, setFocusInput] = useState(true);
	const [loading, setLoading] = useState(false);
	const [locationOptions, setLocationOptions] = useState({
		countries: [],
		states: [],
		cities: [],
	});
	const { mutate: mutateEditJobOpening } = useEditJobOpening();
	const clientSectionVisits = useRef(0);
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
	const [salary, setSalary] = useState({
		currencySymbol: findCurrencySymbol ?? '$',
		currency: jobOpeningDetails?.currency_code ?? 'USD',
		min: jobOpeningDetails?.min_salary ? `${jobOpeningDetails?.min_salary}` : '',
		max: jobOpeningDetails?.max_salary ? `${jobOpeningDetails?.max_salary}` : '',
	});

	const [department, setDepartment] = useState({
		existingDepartment: '',
		newDepartment: '',
		enableNewDepartment: false,
	});
	const [client, setClient] = useState({
		id: jobOpeningDetails?.client_id ?? '',
		existingClientOptions: [],
		existingClient: jobOpeningDetails?.client_name ?? '',
		newClient: '',
		enableNewClient: false,
		clientLocation: {
			city: jobOpeningDetails?.client_location?.city ?? '',
			state: jobOpeningDetails?.client_location?.state ?? '',
			country: jobOpeningDetails?.client_location?.country ?? '',
		},
		...(jobOpeningDetails?.client_id
			? {
				selectedExistingClient: {
					city_id: jobOpeningDetails?.client_city_id ?? '',
					client_email: jobOpeningDetails?.client_email ?? '',
					client_id: jobOpeningDetails?.client_id ?? '',
					client_name: jobOpeningDetails?.client_name ?? '',
					client_phone: jobOpeningDetails?.client_phone ?? '',
					contact: jobOpeningDetails?.contact ?? '',
					country_id: jobOpeningDetails?.client_country_id ?? '',
					state_id: jobOpeningDetails?.client_state_id ?? '',
				},
			}
			: {}),
	});
	const [fees, setFees] = useState({
		currencySymbol: findCurrencySymbol ?? '$',
		currency: jobOpeningDetails?.currency_code ?? 'USD',
		amount: jobOpeningDetails?.agency_commision_fee_value ? `${jobOpeningDetails?.agency_commision_fee_value}` : '',
		percentage: jobOpeningDetails?.agency_commision_fee_percent ? `${jobOpeningDetails?.agency_commision_fee_percent}` : '',
	});
	const [contact, setContact] = useState({
		name: jobOpeningDetails?.contact ?? '',
		email: jobOpeningDetails?.client_email ?? '',
		phone: jobOpeningDetails?.client_phone ?? '',
	});
	const [notes, setNotes] = useState(jobOpeningDetails?.summary ?? '');

	const [savedData, setSavedData] = useState({
		jobTitle: '',
		location: {
			city: '',
			state: '',
			country: '',
		},
		salary: {
			currencySymbol: '$',
			currency: 'USD',
			min: '',
			max: '',
		},
		department: {
			existingDepartment: '',
			newDepartment: '',
			enableNewDepartment: false,
		},
		client: {
			existingClient: '',
			newClient: '',
			enableNewClient: false,
			clientLocation: {
				city: '',
				state: '',
				country: '',
			},
		},
		fees: {
			currencySymbol: '$',
			currency: 'USD',
			amount: '',
			percentage: '',
		},
		contact: {
			name: '',
			email: '',
			phone: '',
		},
		notes: '',
	});
	const [unsavedDataExists, setUnsavedDataExists] = useState(false);
	const savedDataCount = useRef(0);
	const [jobCreated, setJobCreated] = useState({
		status: false,
		id: null,
		createdClientId: null,
	});
	// const formRenderCount = useRef(0);

	const fetchCountriesData = async () => {
		const data = await AIGetAPIRequest(API_GET_COUNTRIES);

		if (data) {
			// const data = await response.json();
			// console.log('Countries data is >>> ', data)
			// console.log('DEBUG COUNTRIES LOG 1')
			setLocationOptions((prevState) => ({ ...prevState, countries: data }));
			// console.log('DEBUG COUNTRIES LOG 2')
			setClientLocationOptions((prevState) => ({ ...prevState, countries: data }));
			// console.log('DEBUG COUNTRIES LOG 3')
			return data;
		}
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

	const fetchClientData = async () => {
		const data = await AIGetAPIRequest(API_GET_CLIENTS);
		// const data = await response.json();
		// console.log('Clients data is >>> ', data)
		// console.log('Client state >>> ', client);
		// console.log('Data length is >>> ', data.length);

		if (data.length === 1) {
			let clientValue = client;
			let contactValue = contact;
			let dataObject = data[0];
			// console.log('DEBUG LOG 1')
			clientValue.selectedExistingClient = dataObject;
			if (dataObject.client_id) {
				clientValue.id = dataObject.client_id;
			}
			// console.log('DEBUG LOG 2')
			if (dataObject.client_name) {
				clientValue.existingClient = dataObject.client_name;
			}
			// console.log('DEBUG LOG 3')
			if (dataObject.client_email) {
				contactValue.email = dataObject.client_email;
			}
			// console.log('DEBUG LOG 4')
			if (dataObject.client_phone) {
				contactValue.phone = dataObject.client_phone;
			}
			// console.log('DEBUG LOG 5')
			if (dataObject.contact) {
				contactValue.name = dataObject.contact;
			}
			// console.log('DEBUG LOG 6')
			if (dataObject.city_id || dataObject.state_id || dataObject.country_id) {
				// clientValue.enableNewClient = true;
			}
			// console.log('DEBUG LOG 7')
			if (dataObject.country_id) {
				// console.log('Client location options > ', clientLocationOptions);
				// console.log('Simple location options > ', locationOptions);
				let countriesData = await fetchCountriesData();
				// console.log('Countries data is >> ', countriesData);
				let clientCountry = countriesData.find((country) => country.id === dataObject.country_id);
				clientValue.clientLocation.country = clientCountry;
				// Nested because state cannot exist without country.
				if (dataObject.state_id) {
					let data = await handleClientStateAndCity(dataObject.country_id, dataObject.state_id, dataObject.city_id);
					// console.log('Client Location data is >>> ', data)
					if (data.statesData.length > 0) {
						let clientState = data.statesData.find((state) => state.id === dataObject.state_id);
						clientValue.clientLocation.state = clientState;
						if (data.citiesData.length > 0) {
							let clientCity = data.citiesData.find((city) => city.id === dataObject.city_id);
							clientValue.clientLocation.city = clientCity;
						}
					}
				}
			}
			clientValue.existingClientOptions = data;
			// console.log('DEBUG LOG 8')
			// console.log('Setting client value to ', clientValue);
			setClient(clientValue);
			setSavedData({
				...savedData,
				client: clientValue,
				contact: contactValue,
			});
			setContact(contactValue);
		} else {
			setClient({ ...client, existingClientOptions: data });
		}
	};

	const validateJobOpeningFormData = async () => {
		// Check Job Title
		if (jobTitle.trim() === '') {
			setActiveSection('JOB_TITLE');
			setFocusInput(true);
			// setErrorSection('JOB_TITLE');
			if (!errorSection.includes('JOB_TITLE')) {
				setErrorSection([...errorSection, 'JOB_TITLE']);
			}
			setErrorMessage('Job Title cannot be empty.');
			return;
		}

		if (salary.min || salary.max) {
			if (salary.currency === '') {
				setActiveSection('SALARY');
				// setErrorSection('SALARY');
				if (!errorSection.includes('SALARY')) {
					setErrorSection([...errorSection, 'SALARY']);
				}
				setErrorMessage('Currency cannot be empty.');
				return;
			}
		}

		if (salary.min && salary.max) {
			if (Number(salary.min) > Number(salary.max)) {
				setActiveSection('SALARY');
				// setErrorSection('SALARY');
				if (!errorSection.includes('SALARY')) {
					setErrorSection([...errorSection, 'SALARY']);
				}
				setErrorMessage('Minimum salary cannot be greater than maximum salary.');
				return;
			}
		}
		// Check Department

		// Check Client
		if (client.existingClient === '' && client.newClient === '') {
			setActiveSection('CLIENT');
			// setErrorSection('CLIENT');
			if (!errorSection.includes('CLIENT')) {
				setErrorSection([...errorSection, 'CLIENT']);
			}
			setErrorMessage('Client cannot be empty.');
			return;
		}
		// if (client.clientLocation.country === '') {
		//     setActiveSection('CLIENT');
		//     setErrorMessage('Client country cannot be empty.');
		//     return
		// }
		// if (client.clientLocation.state === '') {
		//     setActiveSection('CLIENT');
		//     setErrorMessage('Client state cannot be empty.');
		//     return
		// }
		// if (client.clientLocation.city === '') {
		//     setActiveSection('CLIENT');
		//     setErrorMessage('Client city cannot be empty.');
		//     return
		// }
		// Check Contact
		// if (contact.name === '') {
		//     setActiveSection('CONTACT');
		//     setErrorMessage('Contact name cannot be empty.');
		//     return
		// }
		// if (contact.email === '') {
		//     setActiveSection('CONTACT');
		//     setErrorMessage('Contact email cannot be empty.');
		//     return
		// }
		// if (contact.phone === '') {
		//     setActiveSection('CONTACT');
		//     setErrorMessage('Contact phone cannot be empty.');
		//     return
		// }
		// Check Fees
		// if (fees.currency === '') {
		//     setActiveSection('FEES');
		//     setErrorMessage('Fees currency cannot be empty.');
		//     return
		// }
		// if (fees.amount === '' && fees.percentage === '') {
		//     setActiveSection('FEES');
		//     setErrorMessage('Fees amount or percentage cannot be empty.');
		//     return
		// }
		// Check Notes

		// If everything is okay, and no errors are thrown
		setErrorMessage('');
		// setErrorSection('')
		setErrorSection(['']);
		setActiveSection('');
		await submitJobOpening();
		return;
	};

	const validateFormOnSectionChange = () => {
		let errorSectionArray = errorSection;
		// Check Job Title
		if (jobTitle.trim() === '') {
			// setActiveSection('JOB_TITLE');
			// setErrorSection('JOB_TITLE');
			if (!errorSectionArray.includes('JOB_TITLE')) {
				// setErrorSection([...errorSection, 'JOB_TITLE'])
				errorSectionArray.push('JOB_TITLE');
			}
			// setErrorMessage('Job Title cannot be empty.');
			// return
		}

		if (salary.min || salary.max) {
			if (salary.currency === '') {
				// setActiveSection('SALARY');
				// setErrorSection('SALARY');
				if (!errorSectionArray.includes('SALARY')) {
					// setErrorSection([...errorSection, 'SALARY'])
					errorSectionArray.push('SALARY');
				}
				// setErrorMessage('Currency cannot be empty.');
				// return
			} else {
				let errorSectionArray = errorSection;
				errorSectionArray = errorSectionArray.filter((section) => section !== 'SALARY');
				// setErrorSection(errorSectionArray)
			}
		}
		// else {
		//     let errorSectionArray = errorSection;
		//     errorSectionArray = errorSectionArray.filter((section) => section !== 'SALARY')
		//     setErrorSection(errorSectionArray)
		// }

		if (salary.min && salary.max) {
			// console.log('Validating salary')
			if (Number(salary.min) > Number(salary.max)) {
				// console.log('Min is greater than max')
				// setActiveSection('SALARY');
				// setErrorSection('SALARY');
				if (!errorSectionArray.includes('SALARY')) {
					// console.log('Adding salary to the error section array', errorSectionArray);
					// setErrorSection([...errorSection, 'SALARY'])
					errorSectionArray.push('SALARY');
				}
				// setErrorMessage('Minimum salary cannot be greater than maximum salary.');
				// return
			} else {
				// console.log('Removing salary from the error section', errorSectionArray);
				errorSectionArray = errorSectionArray.filter((section) => section !== 'SALARY');
				// setErrorSection(errorSectionArray)
			}
		}
		// else {
		//     let errorSectionArray = errorSection;
		//     errorSectionArray = errorSectionArray.filter((section) => section !== 'SALARY')
		//     setErrorSection(errorSectionArray)
		// }
		// Check Department

		// Check Client
		if (client.existingClient === '' && client.newClient === '' && clientSectionVisits.current > 0) {
			// setActiveSection('CLIENT');
			// setErrorSection('CLIENT');
			if (!errorSection.includes('CLIENT')) {
				errorSectionArray.push('CLIENT');
			}
			// setErrorMessage('Client cannot be empty.');
			// return
		} else {
			// console.log('Removing client from the error section', errorSectionArray);
			errorSectionArray = errorSectionArray.filter((section) => section !== 'CLIENT');
			// setErrorSection(errorSectionArray)
		}
		setErrorSection(errorSectionArray);
		return;
	};

	const handleCancelClick = () => {
		// console.log('Last Saved Data is > ', savedData)
		// Revert all the changes back to last saved data
		if (canCloseCard) {
			setJobCardVisibility('none');
			// console.log('Job card should be hidden now.')
			return;
		}
		setJobTitle(savedData.jobTitle);
		setLocation(savedData.location);
		setSalary(savedData.salary);
		setDepartment(savedData.department);
		// setClient(savedData.client);
		setClient({
			...savedData.client,
			existingClientOptions: client.existingClientOptions,
		});
		setFees(savedData.fees);
		// console.log('Setting Contact 1', savedData.contact);
		setContact({ ...savedData.contact });
		setNotes(savedData.notes);
		setActiveSection('');
		setErrorSection([]);
		setErrorMessage('');
		setCanCloseCard(true);
		savedDataCount.current = 0;
	};

	const submitJobOpening = async (data) => {
		if (isEditing) {
			setLoading(true)
			const payload = {
				job_opening_id: jobOpeningDetails?.job_opening_id,
				client_id: jobOpeningDetails?.client_id,
				client_name: client.newClient || client.existingClient,
				client_email: contact.email,
				client_phone: contact.phone?.toString(),
				country_name: client.clientLocation.country ? client.clientLocation.country : {},
				state_name: client.clientLocation.state ? client.clientLocation.state : {},
				city_name: client.clientLocation.city ? client.clientLocation.city : {},
				contact: contact,
				job_title: jobTitle,
				job_country_name: location.country ? location.country : {},
				job_state_name: location.state ? location.state : {},
				job_city_name: location.city ? location.city : {},
				min_salary: salary.min || 0,
				max_salary: salary.max || 0,
				commission_fee_value: fees?.amount || 0,
				commission_fee_pct: fees?.percentage || 0,
				currency_code: salary?.currency,
				summary: notes,
			};
			// console.log('Payload is ', payload);
			mutateEditJobOpening(payload, {
				onSuccess: () => {
					setLoading(false)
					onCloseModal && onCloseModal();
					setRefetchData && setRefetchData(true);
				},
				onError: () => {
					setLoading(false)
				}
			});
			return;
		}
		const toSubmit = {
			client_id: jobCreated.createdClientId ? jobCreated.createdClientId : client.id ? client.id : '',
			client_name: client.newClient || client.existingClient,
			client_department: department.existingDepartment || department.newDepartment,
			client_email: contact.email,
			client_phone: contact.phone?.toString(),
			country_name: client.clientLocation.country ? client.clientLocation.country : {},
			state_name: client.clientLocation.state ? client.clientLocation.state : {},
			// custom city names will still return as id 0 from server on fetch, so no point saving them at present
			city_name: client.clientLocation.city ? client.clientLocation.city : {},
			contact: contact,
			job_opening_id: jobCreated.id ? jobCreated.id : null,
			job_title: jobTitle,
			job_country_name: location.country ? location.country : {},
			job_state_name: location.state ? location.state : {},
			job_city_name: location.city ? location.city : {},
			// TODO: Find working schema to allow these to just be empty string by default
			min_salary: salary.min,
			max_salary: salary.max,
			commission_fee_value: fees.amount,
			commission_fee_pct: fees.percentage,
			currency_code: salary.currency,
			commission_currency: fees.currency,
			summary: notes,
		};
		// console.log('Payload 2 is ', toSubmit);
		setLoading(true);
		try {
			await AIPostAPIRequest(API_UPDATE_CLIENTS, toSubmit)
				.then((response) => {
					// console.log('API Save Response is > ', response)
					if (response.message === 'Success') {
						savedDataCount.current += 1;
						setUnsavedDataExists(false);
						// Save Data to savedData state only if successful.
						// console.log('Setting saved data here');
						setSavedData({
							jobTitle: jobTitle,
							location: location,
							salary: salary,
							department: department,
							client: client,
							fees: fees,
							contact: contact,
							notes: notes,
						});

						enqueueSnackbar('Client processed!');
						setLoading(false);
						setJobCreated({ status: true, id: response.job_opening_id, createdClientId: response.client_id });
					}
				})
				.catch((error) => {
					setLoading(false);
					// console.log('API Save Error is > ', error)
				});
		} catch (error) {
			await enqueueSnackbar('Error processing client', { variant: 'error' });
		}

		handleSetContext(toSubmit);
	};

	const handleSetContext = async (payload) => {
		const body = {
			conversation_id: conversationGuid,
			event_id: props.id,
			category: 'CREATE_JOB_OPENING',
			payload: payload,
		};
		try {
			await setChatContext(body);
		} catch (err) {
			console.error(err);
		}
	};

	const checkIfUnsavedDataExists = () => {
		if (jobTitle !== savedData.jobTitle) {
			setUnsavedDataExists(true);
			setCanCloseCard(false);
			console.log('Job title is not equal to saved data.');
			return;
		}
		if (location.city !== savedData.location.city) {
			setUnsavedDataExists(true);
			setCanCloseCard(false);
			console.log('Location city is not equal to saved data.');
			return;
		}
		if (location.state !== savedData.location.state) {
			setUnsavedDataExists(true);
			setCanCloseCard(false);
			console.log('Location state is not equal to saved data.');
			return;
		}
		if (location.country !== savedData.location.country) {
			setUnsavedDataExists(true);
			setCanCloseCard(false);
			console.log('Location country is not equal to saved data.');
			return;
		}
		if (salary.currency !== savedData.salary.currency) {
			setUnsavedDataExists(true);
			setCanCloseCard(false);
			console.log('Salary currency is not equal to saved data.');
			return;
		}
		if (salary.min !== savedData.salary.min) {
			setUnsavedDataExists(true);
			setCanCloseCard(false);
			console.log('Salary min is not equal to saved data.');
			return;
		}
		if (salary.max !== savedData.salary.max) {
			setUnsavedDataExists(true);
			setCanCloseCard(false);
			console.log('Salary max is not equal to saved data.');
			return;
		}
		// if (department.existingDepartment !== savedData.department.existingDepartment) {
		//     setUnsavedDataExists(true);
		//     return
		// }
		// if (department.newDepartment !== savedData.department.newDepartment) {
		//     setUnsavedDataExists(true);
		//     return
		// }
		// if (department.enableNewDepartment !== savedData.department.enableNewDepartment) {
		//     setUnsavedDataExists(true);
		//     return
		// }
		if (client.existingClient !== savedData.client.existingClient) {
			setUnsavedDataExists(true);
			setCanCloseCard(false);
			console.log('Client existing client is not equal to saved data.', savedData);
			return;
		}
		if (client.newClient !== savedData.client.newClient) {
			setUnsavedDataExists(true);
			setCanCloseCard(false);
			console.log('Client new client is not equal to saved data.');
			return;
		}
		// if (client.enableNewClient !== savedData.client.enableNewClient) {
		//     setUnsavedDataExists(true);
		//     return
		// }
		if (client.clientLocation.city !== savedData.client.clientLocation.city) {
			setUnsavedDataExists(true);
			setCanCloseCard(false);
			console.log('Client location city is not equal to saved data.');
			return;
		}
		if (client.clientLocation.state !== savedData.client.clientLocation.state) {
			setUnsavedDataExists(true);
			setCanCloseCard(false);
			console.log('Client location state is not equal to saved data.');
			return;
		}
		if (client.clientLocation.country !== savedData.client.clientLocation.country) {
			setUnsavedDataExists(true);
			setCanCloseCard(false);
			console.log('Client location country is not equal to saved data.');
			return;
		}
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
		return;
	};

	const handleActiveSectionChangeOnTabPress = (e) => {
		if (e.keyCode === 9) {
			// e.stopPropagation()
			// e.preventDefault();
			// console.log('TAB KEY PRESSED', sectionList.indexOf(activeSection), activeSection);
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

	// useEffect(() => {
	//     getLocation();
	// }, [])

	// useEffect(() => {
	//     console.log('Saved Data Updated.')
	// }, [savedData])

	useEffect(() => {
		// Focusing job title input on component mount
		// setFocusInput(true);
		// console.log('Fetching countries data')
		fetchCountriesData();
		// console.log('Fetching client Data')
		fetchClientData();
	}, []);

	useEffect(() => {
		if (location.country !== 'UNKNOWN' && location.country) {
			// console.log('Fetching states data.')
			fetchStatesData('location');
		}
	}, [location.country]);

	useEffect(() => {
		if (location.state !== 'UNKNOWN' && location.state) {
			// console.log('Fetching cities data.')
			fetchCitiesData('location');
		}
	}, [location.state]);

	useEffect(() => {
		if (client.clientLocation.country !== 'UNKNOWN' && client.clientLocation.country) {
			// console.log('Fetching states data.')
			fetchStatesData('client');
		}
	}, [client.clientLocation.country]);

	useEffect(() => {
		if (client.clientLocation.state !== 'UNKNOWN' && client.clientLocation.state) {
			// console.log('Fetching cities data.')
			fetchCitiesData('client');
		}
	}, [client.clientLocation.state]);

	useEffect(() => {
		if (activeSection) {
			validateFormOnSectionChange();
		}

		// Perform form validations here on activeSection changes.
		if (activeSection === 'CLIENT') {
			// console.log('Client section visited atleast once.')
			clientSectionVisits.current += 1;
		}
	}, [activeSection]);

	useEffect(() => {
		// Need to compare if data is not equal to saved data, then show the save button.
		// Compare all the data within the objects individually.
		checkIfUnsavedDataExists();
	}, [
		jobTitle,
		location.city,
		location.state,
		location.country,
		salary.currency,
		salary.min,
		salary.max,
		// department.existingDepartment,
		// department.newDepartment,
		// department.enableNewDepartment,
		client.existingClient,
		client.newClient,
		// client.enableNewClient,
		client.clientLocation.city,
		client.clientLocation.state,
		client.clientLocation.country,
		fees.currency,
		fees.amount,
		fees.percentage,
		contact.name,
		contact.email,
		contact.phone,
		notes,
	]);

	return (
		<OutputCard {...props} showClose={(isEditing || jobCreated.status)} title={isEditing || jobCreated.status ? 'Edit job opening' : 'Create job opening'} showActions={false} isATSCard closeCard={() => handleCardClose(props)}>
			<Stack onKeyDown={(e) => handleActiveSectionChangeOnTabPress(e)} gap={3} width={{ xs: '100%', md: '100%' }} minWidth={{ md: jobOpeningDetails ? '600px' : null }} flexDirection={'column'} sx={{ backgroundColor: 'white', maxWidth: '650px', display: jobCardVisibility }}>
				<CreateJobTitle
					setHovered={setHovered}
					hovered={hovered}
					setErrorMessage={setErrorMessage}
					setErrorSection={setErrorSection}
					errorSection={errorSection}
					focusInput={focusInput}
					jobTitle={jobTitle}
					setJobTitle={setJobTitle}
					setActiveSection={setActiveSection}
					activeSection={activeSection === 'JOB_TITLE'}
				/>
				<CreateLocationSection setHovered={setHovered} hovered={hovered} errorSection={errorSection} locationOptions={locationOptions} location={location} setLocation={setLocation} setActiveSection={setActiveSection} activeSection={activeSection === 'LOCATION'} />
				<CreateSalarySection
					setHovered={setHovered}
					hovered={hovered}
					feesCurrencyVisits={feesCurrencyVisits}
					setErrorSection={setErrorSection}
					errorSection={errorSection}
					setErrorMessage={setErrorMessage}
					errorMessage={errorMessage}
					fees={fees}
					setFees={setFees}
					currencyOptions={currencyOptions}
					setSalary={setSalary}
					salary={salary}
					setActiveSection={setActiveSection}
					activeSection={activeSection === 'SALARY'}
				/>
				{/* <CreateDepartmentSection setDepartment={setDepartment} department={department} setActiveSection={setActiveSection} activeSection={activeSection === 'DEPARTMENT'} /> */}
				<CreateClientSection
					setHovered={setHovered}
					hovered={hovered}
					setErrorSection={setErrorSection}
					errorSection={errorSection}
					fetchCitiesData={fetchCitiesData}
					fetchStatesData={fetchStatesData}
					setContact={setContact}
					contact={contact}
					clientLocationOptions={clientLocationOptions}
					setClient={setClient}
					client={client}
					setActiveSection={setActiveSection}
					activeSection={activeSection === 'CLIENT'}
				/>
				<CreateContactSection setHovered={setHovered} hovered={hovered} errorSection={errorSection} contact={contact} setContact={setContact} setActiveSection={setActiveSection} activeSection={activeSection === 'CONTACT'} />
				<CreateFeesSection
					setHovered={setHovered}
					feesCurrencyVisits={feesCurrencyVisits}
					setFeesCurrencyVisits={setFeesCurrencyVisits}
					hovered={hovered}
					errorSection={errorSection}
					currencyOptions={currencyOptions}
					fees={fees}
					salary={salary}
					setFees={setFees}
					setSalary={setSalary}
					setActiveSection={setActiveSection}
					activeSection={activeSection === 'FEES'}
				/>
				<CreateNotesSection setHovered={setHovered} hovered={hovered} errorSection={errorSection} notes={notes} setNotes={setNotes} setActiveSection={setActiveSection} a activeSection={activeSection === 'NOTES'} />
				{errorMessage !== '' ? <Alert severity='error'>{errorMessage}</Alert> : null}
				<JobCardControls
					event_id={event_id}
					type={type}
					canCloseCard={canCloseCard}
					unsavedDataExists={unsavedDataExists}
					savedDataCount={savedDataCount}
					handleCancelClick={() => {
						handleCardClose(props);
						handleCancelClick();
					}}
					validateJobOpeningFormData={validateJobOpeningFormData}
					activeSection={activeSection}
					setActiveSection={setActiveSection}
					onCloseModal={onCloseModal}
					loading={loading}
				/>
			</Stack>
		</OutputCard>
	);
};

// ALL THE MINOR COMPONENTS ARE BELOW. THE ENTIRE JOB COMPONENT THAT HAS THE GLOBAL LOGIC IS RENDERED ABOVE.
// MINOR COMPONENTS INCLUDE
// 1. JobCardHeader
// 2. JobCardControls
// 3. CreateJobTitle
// 4. CreateLocationSection
// 5. CreateSalarySection
// 6. CreateDepartmentSection
// 7. CreateClientSection
// 8. CreateFeesSection
// 9. CreateContactSection
// 10. CreateNotesSection
// 11. SectionHeading
// 12. EditIcon

const JobCardControls = ({ setActiveSection, activeSection, validateJobOpeningFormData, handleCancelClick, savedDataCount, unsavedDataExists, canCloseCard, onCloseModal, loading, event_id, type }) => {
	return (
		<Stack flexDirection={'row'} justifyContent={'space-between'} alignItems={'center'}>
			<Box>{/* <img src={'/assets/icons/components/upload_icon.svg'}></img> */}</Box>
			<Stack flexDirection={'row'} gap={1} justifyContent={'flex-end'} alignItems={'center'}>
				{
					// savedDataCount.current > 0
					// ?
					unsavedDataExists || canCloseCard ? (
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
				}
				{unsavedDataExists && (
					<LoadingButton
						onClick={() => {
							validateJobOpeningFormData();
						}}
						sx={{ backgroundColor: '#170058' }}
						variant={'contained'}
						loading={loading}
					>
						Save
					</LoadingButton>
				)}
				<UserFeedback event_id={event_id} type={type} />
			</Stack>
		</Stack>
	);
};

const CreateJobTitle = ({ setErrorSection, setErrorMessage, activeSection, jobTitle, setJobTitle, setActiveSection, focusInput, errorSection, setHovered, hovered }) => {
	const handleJobTitle = (e) => {
		const jobTitle = e.target.value;
		if (jobTitle !== null) {
			setErrorMessage('');
			// let errorSectionArray = errorSection;
			setJobTitle(jobTitle);
		}
	};

	let label = 'JOB_TITLE';

	return (
		<Stack onClick={() => setActiveSection('JOB_TITLE')} onMouseOver={() => setHovered(label)} onMouseLeave={() => setHovered(false)} flexDirection={'row'} sx={{ width: '100%', cursor: 'pointer' }} justifyContent={'space-between'} alignItems={'center'} gap={1}>
			{!activeSection && jobTitle === '' ? (
				<Stack gap={2} width={'100%'} onClick={() => setActiveSection('JOB_TITLE')} sx={{ cursor: 'pointer' }} flexDirection={'row'} justifyContent={'flex-start'} alignItems={'center'}>
					<SectionHeading hovered={hovered === label} activeSection={activeSection} errorSection={errorSection.includes('JOB_TITLE')} headingName={'Job Title&#42;'} />
					{hovered === label ? <EditIcon setActiveSection={setActiveSection} label='JOB_TITLE' /> : null}
				</Stack>
			) : activeSection ? (
				<TextField autoComplete='off' autoFocus={true} value={jobTitle} fullWidth onChange={(e) => handleJobTitle(e)} variant={'outlined'} label={'Job Title'} placeholder='Enter job title...' />
			) : !activeSection && jobTitle !== '' ? (
				<Stack width={'100%'} flexDirection={'row'} alignItems={'center'} justifyContent={'flex-start'} gap={2}>
					<Typography sx={{ color: hovered === label ? '#9859E0' : '#21054C' }} hovered={hovered === label} fontWeight={700} fontSize={'22px'}>
						{jobTitle}
					</Typography>
					{hovered === label ? <EditIcon setActiveSection={setActiveSection} label='JOB_TITLE' /> : null}
					{/* <EditIcon setActiveSection={setActiveSection} label="JOB_TITLE" /> */}
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
							{location.country.name !== 'UNKNOWN' ? location.country?.name : ''}
							{location.country.name !== 'UNKNOWN' && location.state.name !== 'UNKNOWN' && location.country?.name ? ', ' : ''}
							{location.state.name !== 'UNKNOWN' ? location.state?.name : ''}
							{(location.country.name !== 'UNKNOWN' || location.state.name !== 'UNKNOWN') && location.city.name !== 'UNKNOWN' ? ', ' : ''}
							{location.city.name !== 'UNKNOWN' ? location.city?.name : ''}
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

const CreateSalarySection = ({ activeSection, setActiveSection, salary, setSalary, currencyOptions, fees, setFees, setErrorMessage, errorMessage, errorSection, setErrorSection, setHovered, hovered, feesCurrencyVisits }) => {
	let label = 'SALARY';

	const handleCurrencyChange = (event) => {
		let currencySymbol = currencyOptions.find((currency) => currency.name === event.target.value);
		// console.log('Currency Symbol is > ', currencySymbol.symbol, event.target.value)
		setSalary({ ...salary, currency: event.target.value, currencySymbol: currencySymbol.symbol });
		// if (!fees.currency) {
		setFees({ ...fees, currency: event.target.value, currencySymbol: currencySymbol.symbol });
		// }
		return;
	};

	const handleMinSalary = (event) => {
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
		// Handle regular expression to take monetary values, cannot start with 0.
		if (salary.max) {
			if (Number(event.target.value) < Number(salary.max)) {
				if (errorMessage) {
					setErrorMessage('');
				}
				let errorSectionArray = errorSection;
				errorSectionArray = errorSectionArray.filter((section) => section !== 'SALARY');
				setErrorSection(errorSectionArray);
			} else {
				let errorSectionArray = errorSection;
				if (!errorSectionArray.includes('SALARY')) {
					errorSectionArray.push('SALARY');
				}
			}
		}
		if (event.target.value === '') {
			let errorSectionArray = errorSection;
			errorSectionArray = errorSectionArray.filter((section) => section !== 'SALARY');
			setErrorSection(errorSectionArray);
		}
		setSalary({ ...salary, min: event.target.value });
	};

	const handleMaxSalary = (event) => {
		let inputValue = event.target.value;
		// console.log('Input value for max salary is >>> ', inputValue, inputValue === '');
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
		// Handle regular expression to take monetary values, cannot start with 0.
		if (salary.min) {
			if (Number(event.target.value) > Number(salary.min)) {
				if (errorMessage) {
					setErrorMessage('');
				}
				let errorSectionArray = errorSection;
				errorSectionArray = errorSectionArray.filter((section) => section !== 'SALARY');
				setErrorSection(errorSectionArray);
			} else {
				let errorSectionArray = errorSection;
				if (!errorSectionArray.includes('SALARY')) {
					errorSectionArray.push('SALARY');
				}
			}
		}
		if (event.target.value === '') {
			let errorSectionArray = errorSection;
			errorSectionArray = errorSectionArray.filter((section) => section !== 'SALARY');
			setErrorSection(errorSectionArray);
		}
		setSalary({ ...salary, max: event.target.value });
	};

	const formatAmount = (amount) => {
		return new Intl.NumberFormat('en-US').format(amount);
	};

	return (
		<Stack onMouseOver={() => setHovered(label)} onMouseLeave={() => setHovered(false)} gap={2} sx={{ width: '100%', cursor: 'pointer' }} flexDirection={'row'} justifyContent={'flex-start'} alignItems={'center'} onClick={() => setActiveSection('SALARY')}>
			<SectionHeading errorSection={errorSection.includes('SALARY')} hovered={hovered === label} activeSection={activeSection} headingName={'Salary'} />
			{
				activeSection ? (
					<Stack width={'100%'} gap={1} flexDirection={'row'} alignItems={'center'} justifyContent={'space-between'}>
						<FormControl sx={{ flex: 1 }}>
							<InputLabel>Currency</InputLabel>
							<Select fullWidth={true} value={salary.currency} label='Currency' onChange={handleCurrencyChange}>
								{currencyOptions.map((item, index) => {
									return (
										<MenuItem key={index} value={item.name}>
											{item.name}
										</MenuItem>
									);
								})}
							</Select>
						</FormControl>
						<TextField autoFocus={true} autoComplete='off' value={salary.min} sx={{ flex: 1 }} type='text' onChange={(e) => handleMinSalary(e)} variant='outlined' label={'Min Salary'} placeholder='Min Salary' />
						<TextField autoComplete='off' value={salary.max} sx={{ flex: 1 }} type='text' onChange={(e) => handleMaxSalary(e)} variant='outlined' label={'Max Salary'} placeholder='Max Salary' />
					</Stack>
				) : salary.min || salary.max ? (
					<Stack width={'100%'} flexDirection={'row'} alignItems={'center'} justifyContent={'flex-start'} gap={2}>
						<Typography variant='body1' sx={{ color: errorSection.includes('SALARY') ? 'red' : 'black' }}>
							{!salary.currency
								? 'Please select currency'
								: salary.currency
									? salary.min && !salary.max
										? salary.currencySymbol + formatAmount(salary.min)
										: salary.min && salary.max
											? salary.currencySymbol + formatAmount(salary.min) + ' - ' + salary.currencySymbol + formatAmount(salary.max)
											: !salary.min && salary.max
												? salary.currencySymbol + formatAmount(salary.max)
												: // <div></div>
												null
									: null}
							{salary.currency ? ' ' + '(' + salary.currency + ')' : null}
						</Typography>
						{hovered === label ? <EditIcon setActiveSection={setActiveSection} label={'SALARY'} /> : null}
						{/* <EditIcon setActiveSection={setActiveSection} label={'SALARY'} /> */}
					</Stack>
				) : hovered === label ? (
					<EditIcon setActiveSection={setActiveSection} label={'SALARY'} />
				) : null
				// <EditIcon setActiveSection={setActiveSection} label={'SALARY'} />
			}
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

const CreateClientSection = ({ activeSection, setActiveSection, client, setClient, clientLocationOptions, setContact, contact, errorSection, setErrorSection, setHovered, hovered }) => {
	let label = 'CLIENT';

	const handleClientStateAndCity = async (country_id, state_id, city_id) => {
		let statesData, citiesData;
		statesData = await AIGetAPIRequest(`${API_GET_STATES}?country_id=${country_id}`);
		// const data = await response.json();
		// console.log('States data is >>> ', statesData)

		if (state_id) {
			citiesData = await AIGetAPIRequest(`${API_GET_CITIES}?state_id=${state_id}`);
			// console.log('Cities data is >>> ', citiesData)
		}

		return { statesData, citiesData };
	};

	const handleExistingClientChange = async (event) => {
		let clientValue = client;
		let contactValue = contact;
		let skipContact = false;
		let errorSectionArray = errorSection;
		// console.log('Error section array in client field is >>> ', errorSectionArray)
		errorSectionArray = errorSectionArray.filter((section) => section !== 'CLIENT');
		setErrorSection(errorSectionArray);

		// console.log('Selected Client is ', event.target.value);
		clientValue.selectedExistingClient = event.target.value;
		if (event.target.value.client_id) {
			clientValue.id = event.target.value.client_id;
		}
		if (event.target.value.client_name) {
			clientValue.existingClient = event.target.value.client_name;
		}
		if (event.target.value.client_email) {
			contactValue.email = event.target.value.client_email;
			skipContact = true;
			// setContact({ ...contact, email: event.target.value.client_email });
		}
		if (event.target.value.client_phone) {
			contactValue.phone = event.target.value.client_phone;
			skipContact = true;
			// setContact({ ...contact, phone: event.target.value.client_phone });
		}
		if (event.target.value.contact) {
			contactValue.name = event.target.value.contact;
			skipContact = true;
			// setContact({ ...contact, name: event.target.value.client_name });
		}
		if (event.target.value.city_id || event.target.value.state_id || event.target.value.country_id) {
			// clientValue.enableNewClient = true;
			// setClient({...client, enableNewClient: true})
		}
		if (event.target.value.country_id) {
			let clientCountry = clientLocationOptions.countries.find((country) => country.id === event.target.value.country_id);
			clientValue.clientLocation.country = clientCountry;
			// setClient({ ...client, clientLocation: { ...client.clientLocation, country: clientCountry } });
			// Nested because state cannot exist without country.
			if (event.target.value.state_id) {
				let data = await handleClientStateAndCity(event.target.value.country_id, event.target.value.state_id, event.target.value.city_id);
				// console.log('Client Location data is >>> ', data)
				if (data.statesData.length > 0) {
					let clientState = data.statesData.find((state) => state.id === event.target.value.state_id);
					clientValue.clientLocation.state = clientState;
					// console.log('Client State is > ', clientState)
					// setClient({ ...client, clientLocation: { ...client.clientLocation, state: clientState } });
					if (data.citiesData.length > 0) {
						let clientCity = data.citiesData.find((city) => city.id === event.target.value.city_id);
						clientValue.clientLocation.city = clientCity;
						// console.log('Client City is > ', clientCity)
						// setClient({ ...client, clientLocation: { ...client.clientLocation, city: clientCity } });
					}
				}
			}
		}
		// console.log('Final Client Value > ', clientValue)
		// console.log('Final Contact Value > ', contactValue)
		setClient(clientValue);
		if (skipContact) {
			// console.log('Setting contact 2');
			setContact(contactValue);
		}
		setActiveSection(skipContact ? 'FEES' : 'CONTACT');
	};

	const handleClientCountryChange = (event) => {
		// console.log('new country is >>> ', event.target.value);
		const target = getObjectById(event.target.value, clientLocationOptions?.countries ?? []);
		setClient({ ...client, clientLocation: { ...client.clientLocation, country: target } });
	};

	const handleClientCityChange = (event) => {
		const target = getObjectById(event.target.value, clientLocationOptions?.cities ?? []);
		setClient({ ...client, clientLocation: { ...client.clientLocation, city: target } });
	};

	const handleClientStateChange = (event) => {
		const target = getObjectById(event.target.value, clientLocationOptions?.states ?? []);
		setClient({ ...client, clientLocation: { ...client.clientLocation, state: target } });
	};
	return (
		<Stack onMouseOver={() => setHovered(label)} onMouseLeave={() => setHovered(false)} gap={2} sx={{ width: '100%', cursor: 'pointer' }} flexDirection={'row'} alignItems={'center'} onClick={() => setActiveSection('CLIENT')}>
			<SectionHeading errorSection={errorSection.includes('CLIENT')} hovered={hovered === label} activeSection={activeSection} headingName={'Client&#42;'} />
			{activeSection ? (
				<Stack width={'100%'} flexDirection={'column'} justifyContent={'center'} gap={1}>
					<Stack width={'100%'} flexDirection={'row'} alignItems={'center'} gap={1}>
						{client.existingClientOptions.length > 0 ? (
							<>
								<FormControl sx={{ flex: 1 }}>
									<InputLabel sx={{}}>Existing Client</InputLabel>
									<Select
										// sx={{ width: 125 }}
										value={client.selectedExistingClient ? client.selectedExistingClient : ''}
										label='Pick Existing Client'
										onChange={handleExistingClientChange}
									>
										{client.existingClientOptions.map((client, index) => {
											return (
												<MenuItem key={'existing-client-option-' + index} value={client}>
													{client.client_name}
												</MenuItem>
											);
										})}
									</Select>
								</FormControl>
								<Typography sx={{}} variant='body1'>
									OR
								</Typography>
							</>
						) : null}
						<Button onClick={() => setClient({ ...client, selectedExistingClient: '', enableNewClient: true, existingClient: '', clientLocation: { country: '', state: '', city: '' } })} sx={{ backgroundColor: '#170058', color: 'white', flex: 1, fontSize: '14px' }} variant='contained'>
							Create a new client
						</Button>
					</Stack>
					{client.enableNewClient || client.existingClient ? (
						<Stack flexDirection={'column'} width={'100%'} gap={1} alignItems={'center'}>
							<Stack width={'100%'} flexDirection={'row'} alignItems={'center'}>
								<TextField
									autoFocus={true}
									autoComplete='off'
									value={client.newClient ? client.newClient : client.existingClient ? client.existingClient : ''}
									onChange={(e) => setClient({ ...client, newClient: e.target.value, existingClient: '', id: '' })}
									sx={{ flex: 1 }}
									variant={'outlined'}
									label={'Client'}
									placeholder='Type client or company name'
								/>
							</Stack>
							<Stack width={'100%'} gap={1} flexDirection={'row'} alignItems={'center'} justifyContent={'space-between'}>
								<FormControl fullWidth>
									<InputLabel>Country</InputLabel>
									<Select
										// sx={{ width: 125 }}
										value={client?.clientLocation?.country?.id}
										label='Country'
										onChange={handleClientCountryChange}
									>
										{clientLocationOptions.countries.map((country, index) => {
											return (
												<MenuItem key={index} value={country?.id}>
													{country.name}
												</MenuItem>
											);
										})}
									</Select>
								</FormControl>
								{clientLocationOptions.states.length > 0 ? (
									<FormControl fullWidth>
										<InputLabel>State</InputLabel>
										<Select
											// sx={{ width: 125 }}
											value={client?.clientLocation?.state?.id}
											label='State'
											onChange={handleClientStateChange}
										>
											{clientLocationOptions.states.map((state, index) => {
												return (
													<MenuItem key={index} value={state?.id}>
														{state.name}
													</MenuItem>
												);
											})}
										</Select>
									</FormControl>
								) : null}
								{clientLocationOptions.cities.length > 0 ? (
									<FormControl fullWidth>
										<InputLabel>City</InputLabel>
										<Select
											// sx={{ width: 125 }}
											value={client?.clientLocation?.city?.id}
											label='City'
											onChange={handleClientCityChange}
										>
											{clientLocationOptions.cities.map((city, index) => {
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
						</Stack>
					) : null}
				</Stack>
			) : (
				<Stack width={'100%'} flexDirection={'row'} alignItems={'center'} justifyContent={'flex-start'} gap={2}>
					<Typography variant='body1'>
						{client?.existingClient || client?.newClient ? client.existingClient || client.newClient : ''}
						{client?.clientLocation?.country?.name && client.clientLocation.country.name !== 'UNKNOWN' ? `, ${client.clientLocation.country.name}` : ''}
						{client.clientLocation?.country?.name && client?.clientLocation?.state?.name && client?.clientLocation?.state?.name !== 'UNKNOWN' ? `, ${client?.clientLocation?.state?.name}` : ''}
						{client?.clientLocation?.state?.name && client?.clientLocation?.city?.name && client?.clientLocation?.city?.name !== 'UNKNOWN' ? `, ${client?.clientLocation?.city?.name}` : ''}
					</Typography>
					{hovered === label ? <EditIcon setActiveSection={setActiveSection} label={'CLIENT'} /> : null}
					{/* <EditIcon setActiveSection={setActiveSection} label={'CLIENT'} /> */}
				</Stack>
			)}
		</Stack>
	);
};

const CreateFeesSection = ({ activeSection, setActiveSection, fees, setFees, currencyOptions, setHovered, hovered, salary, setSalary, feesCurrencyVisits, setFeesCurrencyVisits }) => {
	let label = 'FEES';

	const handleFeesCurrencyChange = (event) => {
		let currencySymbol = currencyOptions.find((currency) => currency.name === event.target.value);
		setSalary({ ...salary, currency: event.target.value, currencySymbol: currencySymbol.symbol });
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
			{hovered === label ? <EditIcon setActiveSection={setActiveSection} label={'CONTACT'} /> : null}
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

export default CreateNewJobRevamp;
