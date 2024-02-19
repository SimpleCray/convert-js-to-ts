import { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { Stack, Typography, Box, Alert } from '@mui/material';
import ModeEditOutlineOutlinedIcon from '@mui/icons-material/ModeEditOutlineOutlined';
import AddCircleRoundedIcon from '@mui/icons-material/AddCircleRounded';
import EditRoundedIcon from '@mui/icons-material/EditRounded';
import { useSnackbar } from 'notistack';
import OutputCard from '../OutputCard';
import { AIGetAPIRequest, AIPostAPIRequest } from 'src/feature/ai-worker/constants';
import FormProvider from 'src/components/hook-form/FormProvider';

// API
import { API_GET_CLIENTS, API_UPDATE_CLIENTS, API_GET_COUNTRIES, API_GET_STATES, API_GET_CITIES } from 'src/config-global';

// New styled components (first pass)
import { StyledAutocomplete, StyledButton, StyledTextField, StyledControlledTextFieldJobOpening, StyledControlledTypographyJobOpening, StyledSelect, StyledControlledTypographyJobTitle, StyledControlledTypographyJobDetails, StyledControlledTypographyError } from './CardStyles';

export default function CreateNewJobOutputCard({ body, outputCardAction, setIsPromptsOpen, ...props }) {
    const anchorRef = useRef(null);

    const { target_api_endpoint, target_path } = props;

    const { enqueueSnackbar } = useSnackbar();

    const [showForm, setShowForm] = useState(false);
    const [showJobOpeningForm, setShowJobOpeningForm] = useState(true);
    const [existingClients, setExistingClients] = useState([]);
    const [selectedClient, setSelectedClient] = useState(null);
    const [selectedDept, setSelectedDept] = useState(null);

    const [countryOptions, setCountryOptions] = useState([]);
    const [stateOptions, setStateOptions] = useState([]);
    const [cityOptions, setCityOptions] = useState([]);

    const [jobStateOptions, setJobStateOptions] = useState([]);
    const [jobCityOptions, setJobCityOptions] = useState([]);
    const [isRowHovered, setIsRowHovered] = useState(false);
    const [activeForm, setActiveForm] = useState('title');
    const [showNewClientForm, setShowNewClientForm] = useState(false)
    const [showNewDeptForm, setShowNewDeptForm] = useState(false)
    const [selectedCurrency, setSelectedCurrency] = useState('AUD');

    const handleFormToggle = (formType) => {
        setActiveForm(activeForm === formType ? activeForm : formType);
    };

    // Handle autoscroll when form shows
    useEffect(() => {
        anchorRef?.current?.scrollIntoView({
            block: 'end',
        });
    }, [showForm, showNewClientForm, showNewDeptForm]);

    const createJobListingSchema = Yup.object().shape({
        company: Yup.string().required('Company name is required'),
        country: Yup.string(),
        state: Yup.string(),
        city: Yup.string().optional(),
        contact: Yup.string(),
        client_email: Yup.string().email('Email must be a valid email address'),
        client_phone: Yup.string(),

        jobTitle: Yup.string().required('Job title is required'),
        jobCountry: Yup.string(),
        jobState: Yup.string(),
        jobCity: Yup.string().notRequired(), // some places have no city values
        // jobSalaryRange: Yup.string(), // swapped for min/max
        jobSalaryMin: Yup.number().typeError('This must be a valid number').nullable(true).transform((_, val) => val === "" ? NUMBER_DEFAULT : val),
        jobSalaryMax: Yup.number().typeError('This must be a valid number').nullable(true).transform((_, val) => val === "" ? NUMBER_DEFAULT : val),
        jobAgencyFeesFixed: Yup.number().typeError('This must be a valid number').nullable(true).transform((_, val) => val === "" ? NUMBER_DEFAULT : val),
        jobAgencyFeesPercentage: Yup.number().typeError('This must be a valid number').nullable(true).transform((_, val) => val === "" ? FLOAT_DEFAULT : val),
        jobCurrency: Yup.string(),
        summary: Yup.string().notRequired(),
    });

    const NUMBER_DEFAULT = 0;
    const FLOAT_DEFAULT = 0.0;

    const defaultValues = {
        company: '',
        country: '',
        state: '',
        department: '',
        city: '',
        contact: '',
        client_email: '',
        client_phone: '',
        jobTitle: '',
        jobCountry: '',
        jobState: '',
        jobCity: '',
        // jobSalaryRange: '',
        jobSalaryMin: NUMBER_DEFAULT,
        jobSalaryMax: NUMBER_DEFAULT,
        jobAgencyFeesFixed: NUMBER_DEFAULT,
        jobAgencyFeesPercentage: FLOAT_DEFAULT,
        jobCurrency: '',
        summary: '',
    };

    const methods = useForm({
        resolver: yupResolver(createJobListingSchema),
        defaultValues,
    });

    const {
        setValue,
        setError,
        clearErrors,
        handleSubmit,
        getValues,
        reset,
        register,
        formState: { isSubmitting, errors },
    } = methods;

    const handleCancelClick = () => {
        clearErrors(['jobTitle']);
        // just clear everything 
        reset();
        setValue('ç', '');
        setValue('country', '');
        setValue('state', '');
        setValue('department', '');
        setValue('city', '');
        setValue('contact', '');
        setValue('client_email', '');
        setValue('client_phone', '');
        setValue('jobTitle', '');
        setValue('jobCountry', '');
        setValue('jobState', '');
        setValue('jobCity', '');
        setValue('jobSalaryMin', NUMBER_DEFAULT);
        setValue('jobSalaryMax', NUMBER_DEFAULT);
        setValue('jobAgencyFeesFixed', NUMBER_DEFAULT);
        setValue('jobAgencyFeesPercentage', FLOAT_DEFAULT);
        setValue('jobCurrency', '');
        setValue('summary', '');

    }

    const currencies = [
        'AUD',
        'CAD',
        'CHF',
        'CNY',
        'EUR',
        'GBP',
        'JPY',
        'NZD',
        'SEK',
        'USD',
    ];

    const onCurrencySelect = (option) => {
        setValue('jobCurrency', option);
    }

    const fetchClients = async () => {
        await AIGetAPIRequest(API_GET_CLIENTS)
            .then((response) => {
                if (response !== null) {
                    setExistingClients(response)
                }
            })
            .catch((error) => {
                console.error('error: ', error);
            });
    };

    const onSubmit = async (data) => {
        const toSubmit = {
            ...(selectedClient && { client_id: selectedClient.client_id }),
            client_name: data.company,
            client_department: data.department,
            client_email: data.client_email,
            client_phone: data.client_phone.toString(),
            country_name: data.country,
            state_name: data.state,
            // custom city names will still return as id 0 from server on fetch, so no point saving them at present
            city_name: data.state !== "" ? data.city : "",
            contact: data.contact,
            job_title: data.jobTitle,
            job_country_name: data.jobCountry,
            job_state_name: data.jobState,
            job_city_name: data.jobState !== "" ? data.jobCity : "",
            // TODO: Find working schema to allow these to just be empty string by default
            min_salary: data.jobSalaryMin === NUMBER_DEFAULT ? '' : data.jobSalaryMin,
            max_salary: data.jobSalaryMax === NUMBER_DEFAULT ? '' : data.jobSalaryMax,
            commission_fee_value: data.jobAgencyFeesFixed === NUMBER_DEFAULT ? '' : data.jobAgencyFeesFixed,
            commission_fee_pct: data.jobAgencyFeesPercentage === FLOAT_DEFAULT ? '' : data.jobAgencyFeesPercentage,
            currency_code: data.jobCurrency,
            summary: data.summary,
        };

        try {
            await AIPostAPIRequest(API_UPDATE_CLIENTS, toSubmit);
            // TODO: add correct success actions (once defined)
            await enqueueSnackbar('Client processed!');
            setShowForm(false);
            setShowNewClientForm(false)
            setSelectedClient(null);
            setSelectedDept(null);
            setShowJobOpeningForm(false);
            await fetchClients();
            reset();
        } catch (error) {
            setError('afterSubmit', {
                ...error,
                message: error.message || error,
            });
        }
    }
        const handleClick = () => {
        if (!showForm) {
            setShowForm(true);
        }
    }

    const handleNewClientClick = () => {
        if (!showNewClientForm) {
            setShowNewClientForm(true);
        }
    }

    const handleNewDeptClick = () => {
        if (!showNewDeptForm) {
            setShowNewDeptForm(true)
        }
    }

    const onClientSelect = async (_, option) => {
        if (option === null) {
            return;
        }

        // to hold values for next api callsselectedDept
        let selectedCountry = null;
        let selectedState = null;

        const getChosenState = async (country) => {
            await AIGetAPIRequest(`${API_GET_STATES}?country_id=${country.id}`)
                .then((response) => {
                    if (response !== null) {
                        const st = response.find((s) => s.id === option.state_id);
                        setStateOptions(response);
                        if (st !== undefined) {
                            selectedState = st;
                            setValue('state', st.name);
                            // Moved to separate function due to potential difference between client and job listing
                            // TODO: Remove when confirmed that it works
                            // setValue('jobState', st.name);
                        }
                    }
                })
                .catch((e) => {
                    console.error('error: ', e);
                    enqueueSnackbar('Error fetching client data. Please try again later.', { variant: 'error' });
                });
        }

        const getChosenCity = async (state) => {
            if (state && state.id) {
                await AIGetAPIRequest(`${API_GET_CITIES}?state_id=${state.id}`)
                    .then((response) => {
                        setCityOptions(response)
                        const city = response.find((c) => c.id === option.city_id);
                        if (city !== undefined) {
                            setValue('city', city.name);
                        }
                    })
                    .catch((e) => {
                        console.error('error: ', e);
                        enqueueSnackbar('Error fetching client data. Please try again later.', { variant: 'error' });
                    });
            }
        }

        const handleGetData = async () => {
            await AIGetAPIRequest(API_GET_COUNTRIES)
                .then((response) => {
                    if (response !== null) {
                        // Temp -- it really wants the key 'label' specifically or throws (annoying, non-breaking) errors
                        const opts = response.map((r) => { return { ...r, label: r.name } });
                        setCountryOptions(opts);

                        const country = response.find((c) => c.id === option.country_id);
                        selectedCountry = country;

                        // Set client values
                        setSelectedClient(option);
                        setValue('company', option.client_name);
                        setValue('country', country.name);
                        setValue('client_email', option.client_email || "");
                        setValue('client_phone', option.client_phone || "");
                        setValue('contact', option.contact || "");
                    }
                })
                .catch((error) => {
                    console.error('error: ', error);
                    enqueueSnackbar('Error fetching client data. Please try again later.', { variant: 'error' });
                });
        };
        await handleGetData();
        await getChosenState(selectedCountry);
        await getChosenCity(selectedState);
        setShowForm(true);
        setShowNewClientForm(true)
    }

    const handleGetRequest = async (url) => {
        return await AIGetAPIRequest(url)
            .then((response) => {
                if (response != null) {
                    return response;
                }
            })
            .catch((error) => {
                console.error('error: ', error);
                enqueueSnackbar('Error fetching states. Please try again later.', { variant: 'error' });
            });
    }

    const onCountrySelect = (_, option) => {
        const currentValues = getValues();
        if (option !== null && currentValues.country !== option.name) {
            setValue('country', option.name);
            // Reset state and city values
            setValue('state', '');
            setValue('city', '');
        }

        const handleGetData = async () => {
            try {
                const states = await handleGetRequest(`${API_GET_STATES}?country_id=${option.id}`);
                const opts = states.map((r) => { return { ...r, label: r.name } });
                setStateOptions(opts);
            } catch (e) {
                console.error(e);
            }
        };
        void handleGetData();
    }

    // same as above, but for job listing
    const onJobCountrySelect = (_, option) => {
        const currentValues = getValues();
        if (option !== null && currentValues.jobCountry !== option.name) {
            setValue('jobCountry', option.name);
            // Reset state and city values
            setValue('jobState', '');
            setValue('jobCity', '');
        }

        const handleGetData = async () => {
            try {
                const states = await handleGetRequest(`${API_GET_STATES}?country_id=${option.id}`);
                const opts = states.map((r) => { return { ...r, label: r.name } });
                setJobStateOptions(opts);
            } catch (e) {
                console.error(e);
            }
        };
        void handleGetData();
    }


    const onStateSelect = (_, option) => {
        const currentValues = getValues();
        if (option !== null && currentValues.country !== option.name) {
            setValue('state', option.name);
            // reset city
            setValue('city', '');
        }

        const handleGetData = async () => {
            await AIGetAPIRequest(`${API_GET_CITIES}?state_id=${option.id}`)
                .then((response) => {
                    if (response !== null) {
                        // Temp -- it really wants the key 'label' specifically or throws (non-breaking) errors
                        const opts = response.map((r) => { return { ...r, label: r.name } });
                        setCityOptions(opts);
                    }
                })
                .catch((error) => {
                    console.error('error: ', error);
                    enqueueSnackbar('Error fetching cities. Please try again later.', { variant: 'error' });
                });
        };
        void handleGetData();
    }

    // Same as above, but for state
    const onJobStateSelect = (_, option) => {
        const currentValues = getValues();
        if (option !== null && currentValues.jobState !== option.name) {
            setValue('jobState', option.name);
            // reset city
            setValue('jobCity', '');
        }

        const handleGetData = async () => {
            await AIGetAPIRequest(`${API_GET_CITIES}?state_id=${option.id}`)
                .then((response) => {
                    if (response !== null) {
                        // Temp -- it really wants the key 'label' specifically or throws (non-breaking) errors
                        const opts = response.map((r) => { return { ...r, label: r.name } });
                        setJobCityOptions(opts);
                    }
                })
                .catch((error) => {
                    console.error('error: ', error);
                    enqueueSnackbar('Error fetching cities. Please try again later.', { variant: 'error' });
                });
        };
        void handleGetData();
    }

    const onCitySelect = (_, option) => {
        if (option !== null) {
            setValue('city', option.name);
        }
    }

    // TODO: Figure out a clean way to combine these
    const handleCityInputChange = (_, val) => {
        setValue('city', val);
    }

    const handleJobCityInputChange = (_, val) => {
        setValue('jobCity', val);
    }

    const onJobCitySelect = (_, option) => {
        if (option !== null) {
            setValue('jobCity', option.name);
        }
    }

    // Fetch countries and clients on mount
    useEffect(() => {
        const handleGetClients = async () => {
            await AIGetAPIRequest(API_GET_CLIENTS)
                .then((response) => {
                    if (response !== null) {
                        setExistingClients(response)
                    }
                })
                .catch((error) => {
                    console.error('error: ', error);
                    enqueueSnackbar('Error fetching clients. Please try again later.', { variant: 'error' });
                });
        };
        const handleGetCountries = async () => {
            await AIGetAPIRequest(API_GET_COUNTRIES)
                .then((response) => {
                    if (response !== null) {
                        // Temp -- it really wants the key 'label' specifically or throws (non-breaking) errors
                        const opts = response.map((r) => { return { ...r, label: r.name } });
                        setCountryOptions(opts);
                    }
                })
                .catch((error) => {
                    console.error('error: ', error);
                    enqueueSnackbar('Error fetching required data', { variant: 'error' });
                });
        };
        void handleGetClients();
        void handleGetCountries();
    }, []);

    const isNonNumeric = (value) => value.match(/[^0-9+]/);

    const numericOptionalOnChange = (e, field) => {
        // If they've already entered 1 or more numbers then don't trigger the error
        if (e.target.value.length === 1 && isNonNumeric(e.target.value)) {
            setError(field, {
                type: 'manual',
                message: 'Only numbers are accepted',
            });
        } else {
            clearErrors(field);
        }
        if (field === 'jobSalaryMax') {
            if (Number(e.target.value) < Number(getValues('jobSalaryMin'))) {
                setError(field, {
                    type: 'manual',
                    message: 'Maximum salary must be greater than minimum salary',
                });
            } else {
                clearErrors(field);
                clearErrors('jobSalaryMin')
            }
        }
        if (field === 'jobSalaryMin') {
            if (Number(e.target.value) > Number(getValues('jobSalaryMax'))) {
                setError(field, {
                    type: 'manual',
                    message: 'Maximum salary must be greater than minimum salary',
                });
            } else {
                clearErrors(field);
                clearErrors('jobSalaryMax')
            }
        }
        setValue(field, Number(e.target.value.replace(/[^0-9+]/g, '')));
    }

    const renderJobTitleRow = (formType) => {
        const { jobTitle } = getValues();
        return (
            <div sx={{
                display: 'flex',
                alignItems: 'center',
                alignSelf: 'stretch',
                justifyContent: 'space-between',
                padding: '6px 8px',
                cursor: 'pointer',
                width: '100%'
            }}

                onMouseEnter={() => setIsRowHovered(label)}
                onMouseLeave={() => setIsRowHovered(false)}
                onClick={() => handleFormToggle(formType)}
            >            <Stack sx={{ my: 1.5 }} direction='row'>

                    {activeForm == 'title' && (
                        <>
                            <StyledControlledTextFieldJobOpening
                                variant='filled'
                                name='jobTitle'
                                label='Job title'
                                placeHolder='Enter Job Title'
                                fullWidth
                                required
                                focused='true'
                            />
                        </>)}
                    {activeForm !== 'title' && (
                        jobTitle ? (
                            <StyledControlledTypographyJobTitle>{jobTitle}</StyledControlledTypographyJobTitle>
                        ) : (
                            <StyledControlledTypographyJobTitle sx={{ color: 'grey' }}>[Job title goes here]</StyledControlledTypographyJobTitle>
                        )
                    )}
                </Stack>
            </div>
        )
    }

    const renderLocationRow = (label, formType) => {
        const { jobCountry, jobState, jobCity } = getValues();
        return (
            <div sx={{
                display: 'flex',
                alignItems: 'center',
                alignSelf: 'stretch',
                justifyContent: 'space-between',
                padding: '6px 8px',
                cursor: 'pointer',
                width: '100%'
            }}

                onMouseEnter={() => setIsRowHovered(label)}
                onMouseLeave={() => setIsRowHovered(false)}
                onClick={() => handleFormToggle(formType)}
            >
                <Stack direction='row' sx={{ display: 'flex', alignItems: 'center', gap: '16px', alignSelf: 'stretch' }}>
                    <StyledControlledTypographyJobOpening>
                        {label}
                    </StyledControlledTypographyJobOpening>
                    {(isRowHovered === label && activeForm !== formType) && (
                        <EditRoundedIcon
                            sx={{
                                width: '24px',
                                height: '24px',
                                marginLeft: '16px',
                                color: '#9BA0AE',
                            }}
                        />
                    )}
                    <Stack direction='row' sx={{ display: 'flex', padding: '6px 8px', alignItems: 'center', gap: '16px', alignSelf: 'stretch' }}>
                        {activeForm == 'location' && (
                            <>
                                <StyledSelect
                                    sx={{ width: '160px', display: 'flex', flexDirection: 'column', alignItems: 'flex-start', flex: '1 0 0', gap: '3px' }}
                                    options={countryOptions}
                                    renderOption={(props, option) => {
                                        return (
                                            <li {...props} key={option.id}>
                                                {option.name}
                                            </li>
                                        );
                                    }}
                                    isOptionEqualToValue={(option, value) => (option.label ? option.label === value : value === '')}
                                    renderInput={(params) => <StyledTextField
                                        sx={{ bbackground: 'transparent', display: 'flex', flexDirection: 'column', alignItems: 'flex-start', width: '160px', height: '61px' }}
                                        variant='filled' label='Country' {...params} />}
                                    label='Country'
                                    name='jobCountry'
                                    onChange={onJobCountrySelect}
                                    onClick={(e) => e.stopPropagation()}
                                    autoSelect
                                    autoHighlight
                                />
                                <StyledSelect
                                    sx={{ width: '160px', display: 'flex', flexDirection: 'column', alignItems: 'flex-start', flex: '1 0 0', gap: '3px' }}
                                    options={jobStateOptions}
                                    renderOption={(props, option) => {
                                        return (
                                            <li {...props} key={option.id}>
                                                {option.name}
                                            </li>
                                        );
                                    }}
                                    isOptionEqualToValue={(option, value) => (option.label ? option.label === value : value === '')}
                                    renderInput={(params) => <StyledTextField
                                        variant='filled' label='State' {...params}
                                        sx={{ background: 'transparent', display: 'flex', flexDirection: 'column', alignItems: 'flex-start', width: '160px', height: '61px' }} />}
                                    label='State'
                                    name='jobState'
                                    onChange={onJobStateSelect}
                                    autoSelect
                                    autoHighlight
                                />
                                <StyledSelect
                                    sx={{ width: '160px', display: 'flex', flexDirection: 'column', alignItems: 'flex-start', flex: '1 0 0', gap: '3px' }}
                                    options={jobCityOptions}
                                    renderOption={(props, option) => {
                                        return (
                                            <li {...props} key={option.id}>
                                                {option.name}
                                            </li>
                                        );
                                    }}
                                    isOptionEqualToValue={(option, value) => (option.label ? option.label === value : value === '')}
                                    renderInput={(params) => <StyledTextField
                                        sx={{ background: 'transparent', display: 'flex', flexDirection: 'column', alignItems: 'flex-start', width: '160px', height: '61px' }}
                                        variant='filled' label='City' {...params} />}
                                    label='City'
                                    name='jobCity'
                                    onChange={onJobCitySelect}
                                    onInputChange={handleJobCityInputChange}
                                    autoSelect
                                    autoHighlight
                                />
                            </>
                        )}
                        {activeForm !== 'location' && (
                            <StyledControlledTypographyJobDetails>
                                {[
                                    jobCountry && `${jobCountry}`,
                                    jobState && `${jobState}`,
                                    jobCity && `${jobCity}`,
                                ]
                                    .filter(Boolean)
                                    .join(', ')}
                            </StyledControlledTypographyJobDetails>
                        )}

                    </Stack>
                </Stack>
            </div>
        )
    };

    const renderSalaryRow = (label, formType) => {
        const { jobCurrency, jobSalaryMin, jobSalaryMax } = getValues();
        return (
            <div sx={{
                display: 'flex',
                alignItems: 'center',
                alignSelf: 'stretch',
                justifyContent: 'space-between',
                padding: '6px 8px',
                cursor: 'pointer',
                width: '100%'
            }}

                onMouseEnter={() => setIsRowHovered(label)}
                onMouseLeave={() => setIsRowHovered(false)}
                onClick={() => handleFormToggle(formType)}
            >
                <Stack direction='row' sx={{ display: 'flex', alignItems: 'center', gap: '16px', alignSelf: 'stretch' }}>
                    <StyledControlledTypographyJobOpening>
                        {label}
                    </StyledControlledTypographyJobOpening>
                    {(isRowHovered === label && activeForm !== formType) && (
                        <EditRoundedIcon
                            sx={{
                                width: '24px',
                                height: '24px',
                                marginLeft: '16px',
                                color: '#9BA0AE',
                            }}
                        />
                    )}
                    <Stack direction='row' sx={{ display: 'flex', padding: '6px 8px', alignItems: 'center', gap: '16px', alignSelf: 'stretch' }}>
                        {activeForm === 'salary' && (
                            <Box
                                rowGap={1.5}
                                columnGap={'8px'}
                                display='grid'
                                gridTemplateColumns={{
                                    xs: 'repeat(1, 1fr)',
                                    sm: 'repeat(2, 1fr)',
                                    md: 'repeat(3, 1fr)',
                                }}
                            >
                                <StyledSelect
                                    sx={{ width: '220px', display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}
                                    options={currencies}
                                    // isOptionEqualToValue={(option, value) => (option ? option === value : value === '')}
                                    isOptionEqualToValue={(option) => option === selectedCurrency}
                                    renderInput={(params) => <StyledTextField value={selectedCurrency ? selectedCurrency : null} variant='filled' label='Currency' {...params} sx={{ background: 'transparent' }} />}
                                    label='Currency'
                                    name='jobCurrency'
                                    onChange={(event) => {
                                        // console.log('Selected currency value is ', event.target.innerHTML);
                                        // onCurrencySelect(event);
                                        setSelectedCurrency(event.target.innerHTML);
                                    }}
                                    autoSelect
                                    autoHighlight
                                />
                                <StyledControlledTextFieldJobOpening sx={{ width: '140px', display: 'flex', flexDirection: 'column', alignItems: 'flex-start', flex: '1 0 0' }} name='jobSalaryMin' label='Minimum salary' variant='filled' onChange={(e) => numericOptionalOnChange(e, 'jobSalaryMin')} />
                                <StyledControlledTextFieldJobOpening sx={{ width: '140px', display: 'flex', flexDirection: 'column', alignItems: 'flex-start', flex: '1 0 0' }} name='jobSalaryMax' label='Maximum salary' variant='filled' onChange={(e) => numericOptionalOnChange(e, 'jobSalaryMax')} />
                            </Box>
                        )}
                        {activeForm !== 'salary' && (
                            <StyledControlledTypographyJobDetails>
                                {[
                                    jobSalaryMin && jobSalaryMin !== 0 ? jobSalaryMin : '',
                                    jobSalaryMax && jobSalaryMax !== 0 && (jobSalaryMin === 0 || !jobSalaryMin) ? ` ${jobSalaryMax}` : jobSalaryMax && jobSalaryMax !== 0 ? `- ${jobSalaryMax}` : null,
                                    selectedCurrency && ` (${selectedCurrency})`,
                                ]
                                    .filter(Boolean)
                                    .join('')}
                            </StyledControlledTypographyJobDetails>
                        )}

                    </Stack>
                </Stack>
            </div>
        )
    };


    const renderDeptRow = (label, formType) => {
        const { department } = getValues();
        return (
            <div sx={{
                display: 'flex',
                alignItems: 'center',
                alignSelf: 'stretch',
                justifyContent: 'space-between',
                padding: '6px 8px',
                cursor: 'pointer',
                width: '100%'
            }}

                onMouseEnter={() => setIsRowHovered(label)}
                onMouseLeave={() => setIsRowHovered(false)}
                onClick={() => handleFormToggle(formType)}
            >
                <Stack direction='row' sx={{ display: 'flex', alignItems: 'center', gap: '16px', alignSelf: 'stretch' }}>
                    <StyledControlledTypographyJobOpening>
                        {label}
                    </StyledControlledTypographyJobOpening>
                    <Stack direction='row' sx={{ display: 'flex', justifyContent: 'space-between', padding: '6px 8px', alignItems: 'center', gap: '16px', alignSelf: 'stretch' }}>
                        {activeForm === 'department' && (
                            <>
                                {/* TO DO: integrate department later */}
                                {/* <Stack direction='row' sx={{ display: 'flex', padding: '6px 8px', alignItems: 'center', gap: '16px', alignSelf: 'stretch' }}>
                                    <StyledAutocomplete
                                        options={existingClients}
                                        getOptionLabel={(client) => client.client_name}
                                        // Without this it relies on name for key, which could results in dupes particularly with test data
                                        renderOption={(props, client) => {
                                            return (
                                                <li {...props} key={client.client_id}>
                                                    {client.client_name}
                                                </li>
                                            );
                                        }}
                                        noOptionsText='No existing departments'
                                        onChange={onClientSelect}
                                        renderInput={(params) => <StyledTextField variant='filled' label='Use existing departments' {...params} sx={{ background: 'transparent' }} />}
                                        sx={{ flex: 1, padding: '8px 0 0', width: '276px', padding: '9px 12px 8px 12px' }}
                                        label='Use existing department'
                                        value={selectedDept}
                                        autoSelect
                                        autoHighlight
                                    />
                                    <span>OR</span>
                                    <StyledButton sx={{ display: 'flex', width: '217px', height: '36px', padding: '8px 16px' }} variant='contained' endIcon={<AddCircleRoundedIcon />} onClick={handleNewClientClick}>
                                        Create a new department
                                    </StyledButton>
                                </Stack>
                                {showNewClientForm && (

                                    <> */}
                                <Box sx={{ my: 1.5 }}>
                                    <StyledControlledTextFieldJobOpening
                                        variant='filled'
                                        name='department'
                                        label='Department'
                                        fullWidth
                                        required
                                    />
                                </Box>
                                {/* </>
                                )}
                            </> */}
                                {/* )} */}
                            </>)}
                        {activeForm !== 'departemnt' && (
                            <StyledControlledTypographyJobDetails>{department ?? ''}</StyledControlledTypographyJobDetails>
                        )}
                    </Stack>
                    {(isRowHovered === label && activeForm !== formType) && (
                        <EditRoundedIcon
                            sx={{
                                width: '24px',
                                height: '24px',
                                marginLeft: '16px',
                                color: '#9BA0AE',
                            }}
                        />
                    )}
                </Stack>
            </div>
        )
    };


    const renderClientRow = (label, formType) => {
        const { company, country } = getValues();
        return (
            <div sx={{
                display: 'flex',
                alignItems: 'center',
                alignSelf: 'stretch',
                justifyContent: 'space-between',
                padding: '6px 8px',
                cursor: 'pointer',
                width: '100%'
            }}

                onMouseEnter={() => setIsRowHovered(label)}
                onMouseLeave={() => setIsRowHovered(false)}
                onClick={() => handleFormToggle(formType)}
            >
                <Stack direction='row' sx={{ display: 'flex', alignItems: 'center', gap: '16px', alignSelf: 'stretch' }}>
                    <StyledControlledTypographyJobOpening>
                        {label}
                    </StyledControlledTypographyJobOpening>
                    {(isRowHovered === label && activeForm !== formType) && (
                        <EditRoundedIcon
                            sx={{
                                width: '24px',
                                height: '24px',
                                marginLeft: '16px',
                                color: '#9BA0AE',
                            }}
                        />
                    )}
                    <Stack direction='column' >
                        {activeForm === 'client' && (
                            <>
                                <Stack direction='row' sx={{ display: 'flex', padding: '6px 8px', alignItems: 'center', gap: '16px', alignSelf: 'stretch' }}>
                                    <StyledAutocomplete
                                        options={existingClients}
                                        getOptionLabel={(client) => client.client_name}
                                        // Without this it relies on name for key, which could results in dupes particularly with test data
                                        renderOption={(props, client) => {
                                            return (
                                                <li {...props} key={client.client_id}>
                                                    {client.client_name}
                                                </li>
                                            );
                                        }}
                                        noOptionsText='No existing clients'
                                        onChange={onClientSelect}
                                        renderInput={(params) => <StyledTextField variant='filled' label='Use existing client' {...params} sx={{ background: 'transparent' }} />}
                                        sx={{ flex: 1, width: '222px', padding: '9px 12px 8px 12px' }}
                                        label='Use existing client'
                                        value={selectedClient}
                                        autoSelect
                                        autoHighlight
                                    />
                                    <span>OR</span>
                                    <StyledButton sx={{ display: 'flex', width: '179px', height: '36px', padding: '8px 16px' }} variant='contained' endIcon={<AddCircleRoundedIcon />} onClick={handleNewClientClick}>
                                        Create a new client
                                    </StyledButton>
                                </Stack>

                                {showNewClientForm && (
                                    <>
                                        <Box sx={{ my: 1.5 }}>
                                            <StyledControlledTextFieldJobOpening
                                                variant='filled'
                                                name='company'
                                                label='Company or department name'
                                                fullWidth
                                                required
                                            />
                                        </Box>
                                        <Box
                                            rowGap={1.5}
                                            columnGap={2}
                                            display='grid'
                                            gridTemplateColumns={{
                                                xs: 'repeat(1, 1fr)',
                                                sm: 'repeat(2, 1fr)',
                                                md: 'repeat(3, 1fr)',
                                            }}
                                        >
                                            <StyledSelect
                                                options={countryOptions}
                                                renderOption={(props, country) => {
                                                    return (
                                                        <li {...props} key={country.id}>
                                                            {country.name}
                                                        </li>
                                                    );
                                                }}
                                                isOptionEqualToValue={(option, value) => (option.label ? option.label === value : value === '')}
                                                renderInput={(params) => (
                                                    <StyledTextField
                                                        variant='filled'
                                                        label='Country'
                                                        {...params}
                                                        sx={{ background: 'transparent' }}
                                                    />
                                                )}
                                                label='Country'
                                                name='country'
                                                onChange={onCountrySelect}
                                                autoSelect
                                                autoHighlight
                                            />
                                            <StyledSelect
                                                options={stateOptions}
                                                renderOption={(props, option) => {
                                                    return (
                                                        <li {...props} key={option.id}>
                                                            {option.name}
                                                        </li>
                                                    );
                                                }}
                                                isOptionEqualToValue={(option, value) => option.name === value}
                                                renderInput={(params) => <StyledTextField variant='filled' label='State' {...params} sx={{ background: 'transparent' }} />}
                                                label='State'
                                                name='state'
                                                onChange={onStateSelect}
                                                autoSelect
                                                autoHighlight
                                            />
                                            <StyledSelect
                                                options={cityOptions}
                                                renderOption={(props, option) => {
                                                    return (
                                                        <li {...props} key={option.id}>
                                                            {option.name}
                                                        </li>
                                                    );
                                                }}
                                                freeSolo
                                                isOptionEqualToValue={(option, value) => option.name === value}
                                                renderInput={(params) => <StyledTextField variant='filled' label='City' {...params} sx={{ background: 'transparent' }} />}
                                                label='City'
                                                name='city'
                                                onChange={onCitySelect}
                                                onInputChange={handleCityInputChange}
                                                autoSelect
                                                autoHighlight
                                            />
                                        </Box>
                                    </>
                                )}
                            </>
                        )}
                        {activeForm !== 'client' && (
                            <StyledControlledTypographyJobDetails>
                                {
                                    company && country ? `${company}, ${country}` :
                                        company && !country ? `${company}` :
                                            !company && country ? `${country}` : ''
                                }
                            </StyledControlledTypographyJobDetails>
                        )}
                    </Stack>
                </Stack>
            </div>
        )
    };

    const renderContactRow = (label, formType) => {
        const { contact, client_email, client_phone } = getValues();
        return (
            <div sx={{
                display: 'flex',
                alignItems: 'center',
                alignSelf: 'stretch',
                justifyContent: 'space-between',
                padding: '6px 8px',
                cursor: 'pointer',
                width: '100%'
            }}

                onMouseEnter={() => setIsRowHovered(label)}
                onMouseLeave={() => setIsRowHovered(false)}
                onClick={() => handleFormToggle(formType)}
            >
                <Stack direction='row' sx={{ display: 'flex', alignItems: 'center', gap: '16px', alignSelf: 'stretch' }}>
                    <StyledControlledTypographyJobOpening>
                        {label}
                    </StyledControlledTypographyJobOpening>
                    {(isRowHovered === label && activeForm !== formType) && (
                        <EditRoundedIcon
                            sx={{
                                width: '24px',
                                height: '24px',
                                marginLeft: '16px',
                                color: '#9BA0AE',
                            }}
                        />
                    )}
                    <Stack direction='row' sx={{ display: 'flex', padding: '6px 8px', alignItems: 'center', gap: '16px', alignSelf: 'stretch' }}>
                        {activeForm === 'contact' && (
                            <Box
                                rowGap={1.5}
                                columnGap={'8px'}
                                display='grid'
                                gridTemplateColumns={{
                                    xs: 'repeat(1, 1fr)',
                                    sm: 'repeat(2, 1fr)',
                                    md: 'repeat(3, 1fr)',
                                }}
                            >
                                <StyledControlledTextFieldJobOpening name='contact' label='Name' placeHolder='Full name' variant='filled' />
                                <StyledControlledTextFieldJobOpening name='client_email' label='Email' placeHolder='Email address' variant='filled' />
                                <StyledControlledTextFieldJobOpening name='client_phone' label='Phone number' placeHolder='Phone number' variant='filled' />
                            </Box>
                        )}
                        {activeForm !== 'contact' && (
                            <StyledControlledTypographyJobDetails>
                                {[
                                    contact && `${contact} <${client_email ?? ''}>`,
                                    client_phone && client_phone !== 0 ? `${client_phone}` : '',
                                ]
                                    .filter(Boolean)
                                    .join(', ')}
                            </StyledControlledTypographyJobDetails>
                        )}

                    </Stack>
                </Stack>
            </div>
        )
    };

    const renderFeeRow = (label, formType) => {
        const { jobAgencyFeesFixed, jobAgencyFeesPercentage, jobCurrency } = getValues();
        return (
            <div sx={{
                display: 'flex',
                alignItems: 'center',
                alignSelf: 'stretch',
                justifyContent: 'space-between',
                padding: '6px 8px',
                cursor: 'pointer',
                width: '100%'
            }}

                onMouseEnter={() => setIsRowHovered(label)}
                onMouseLeave={() => setIsRowHovered(false)}
                onClick={() => handleFormToggle(formType)}
            >
                <Stack direction='row' sx={{ display: 'flex', alignItems: 'center', gap: '16px', alignSelf: 'stretch' }}>
                    <StyledControlledTypographyJobOpening>
                        {label}
                    </StyledControlledTypographyJobOpening>
                    {(isRowHovered === label && activeForm !== formType) && (
                        <EditRoundedIcon
                            sx={{
                                width: '24px',
                                height: '24px',
                                marginLeft: '16px',
                                color: '#9BA0AE',
                            }}
                        />
                    )}
                    <Stack direction='row' sx={{ display: 'flex', padding: '6px 8px', alignItems: 'center', gap: '16px', alignSelf: 'stretch' }}>
                        {activeForm === 'fee' && (
                            <>
                                <StyledSelect
                                    options={currencies}
                                    isOptionEqualToValue={(option, value) => (option ? option === value : value === '')}
                                    renderInput={(params) => <StyledTextField variant='filled' label='Currency' {...params} sx={{ background: 'transparent' }} />}
                                    label='Currency'
                                    name='jobCurrency'
                                    onChange={(event) => {
                                        onCurrencySelect(event.target.innerHTML);
                                    }}
                                    autoSelect
                                    autoHighlight
                                />
                                <StyledControlledTextFieldJobOpening name='jobAgencyFeesFixed' label='Agency fees' variant='filled' onChange={(e) => {
                                    numericOptionalOnChange(e, 'jobAgencyFeesFixed')
                                }} />
                                <span>OR</span>
                                <StyledControlledTextFieldJobOpening name='jobAgencyFeesPercentage' label='Agency %' variant='filled' onChange={(e) => {
                                    numericOptionalOnChange(e, 'jobAgencyFeesPercentage')
                                }} />
                            </>
                        )}
                        <StyledControlledTypographyJobDetails>
                            {[
                                jobAgencyFeesPercentage && jobAgencyFeesPercentage !== 0 ? `Agency fees: ${jobAgencyFeesPercentage} %` : '',
                                jobAgencyFeesFixed && jobAgencyFeesFixed !== 0 ? `${jobAgencyFeesFixed}` : '',
                                selectedCurrency && selectedCurrency !== '' ? `(${jobCurrency})` : '',
                            ]
                                .filter(Boolean)
                                .join(' ')
                                .trim()
                                ? (
                                    <StyledControlledTypographyJobDetails>
                                        {[
                                            jobAgencyFeesPercentage && jobAgencyFeesPercentage !== 0 ? `Agency fees: ${jobAgencyFeesPercentage} %` :
                                                jobAgencyFeesFixed && jobAgencyFeesFixed !== 0 ? `${jobAgencyFeesFixed} ${jobCurrency}` : '',
                                        ]
                                            .filter(Boolean)
                                            .join(' ')
                                        }
                                    </StyledControlledTypographyJobDetails>
                                ) : null
                            }

                        </StyledControlledTypographyJobDetails>


                    </Stack>
                </Stack>
            </div>
        )
    };

    const renderNotesRow = (label, formType) => {
        const { summary } = getValues();
        return (
            <div sx={{
                display: 'flex',
                alignItems: 'center',
                alignSelf: 'stretch',
                justifyContent: 'space-between',
                padding: '6px 8px',
                cursor: 'pointer',
                width: '100%'
            }}

                onMouseEnter={() => setIsRowHovered(label)}
                onMouseLeave={() => setIsRowHovered(false)}
                onClick={() => handleFormToggle(formType)}
            >
                <Stack direction='row' sx={{ display: 'flex', alignItems: 'center', gap: '16px', alignSelf: 'stretch' }}>
                    <StyledControlledTypographyJobOpening>
                        {label}
                    </StyledControlledTypographyJobOpening>
                    {(isRowHovered === label && activeForm !== formType) && (
                        <EditRoundedIcon
                            sx={{
                                width: '24px',
                                height: '24px',
                                marginLeft: '16px',
                                color: '#9BA0AE',
                            }}
                        />
                    )}
                    <Stack direction='row' sx={{ display: 'flex', padding: '6px 8px', alignItems: 'center', gap: '16px', alignSelf: 'stretch' }}>
                        {activeForm === 'note' && (
                            <>
                                <StyledControlledTextFieldJobOpening variant='filled' name='summary' label='Notes' sx={{ width: '496px' }} placeHolder='Optional' />
                            </>
                        )}
                        {activeForm !== 'note' && (
                            <StyledControlledTypographyJobDetails>{summary ?? ''}</StyledControlledTypographyJobDetails>)}
                    </Stack>
                </Stack>
            </div>
        )
    };

    const returnErrors = (errors) => {
        const e = [];
        for (const [k, v] of Object.entries(errors)) {
            e.push(v);
        }
        return e;
    }

    return (
        <>
            {showJobOpeningForm && (
                <OutputCard showActions={false} {...props} isPromptCard isATSCard sx={{ width: '100%' }} title={props.title ?? 'Create job opening'}>
                    <>
                        <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
                            <Stack>
                                {renderJobTitleRow('title')}
                                {renderLocationRow('Location *', 'location')}
                                {renderSalaryRow('Salary', 'salary')}
                                {/* {renderDeptRow('Department *', 'department')} */}
                                {renderClientRow('Client *', 'client')}
                                {renderContactRow('Contact', 'contact')}
                                {renderFeeRow('Fees', 'fee')}
                                {renderNotesRow('Notes', 'note')}

                            </Stack>
                            {!!errors.afterSubmit && (
                                <Alert severity='error' sx={{ mb: '1rem' }}>
                                    There was an issue saving the job opening, please try again later.
                                </Alert>
                            )}

                            {returnErrors(errors).map((e, index) => (
                                <StyledControlledTypographyError key={index}>{e.message}</StyledControlledTypographyError>
                            ))}
                            <Stack direction='row' justifyContent='space-between'>
                                <Box>&nbsp;</Box>
                                <Stack direction='row'>
                                    <StyledButton type='submit' variant='outlined' color='primary' onClick={handleCancelClick} sx={{ mr: 2.5 }}>
                                        Cancel
                                    </StyledButton>
                                    <StyledButton type='submit' variant='contained' color='primary'>
                                        Save
                                    </StyledButton>
                                </Stack>
                            </Stack>
                        </FormProvider>
                        <div ref={anchorRef} />
                    </>
                </OutputCard>
            )}
        </>
    );
}
