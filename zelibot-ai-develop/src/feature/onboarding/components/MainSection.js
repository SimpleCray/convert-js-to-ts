import {useEffect, useState} from "react";
import {FormProvider} from "react-hook-form";
import {LoadingButton} from "@mui/lab";
import {Box, FormControl, FormControlLabel, Grid, Radio, RadioGroup, Stack, styled} from "@mui/material";
import {isNil} from "lodash";

import {default as AvatarSelector} from "./avatar-selector";
import {RHFTextField} from "../../../components/hook-form";
import {StyledSelect, StyledTextField} from "../../ai-worker/components/output-card/cards/CardStyles";
import {UploadFiles} from "../../ai-worker/components";
import {AIGetAPIRequest} from "../../ai-worker/constants";
import {API_GET_CITIES, API_GET_COUNTRIES, API_GET_STATES} from "../../../config-global";
import {MAIN_SECTION_COMPONENT_ID, postAssistantId} from "../constants";
import {CenterBox, Section, StyledContainer, StyledTypography} from "./ComponentStyles";
import {default as DocumentType} from "./DocumentType";
import {getCompanyDetails, postCompanyDetails} from "../../../constants";
import {useRouter} from "../../../hooks/useRouter";
import {PATH_DASHBOARD} from "../../../routes/paths";
import {SoundIconAnimate} from "../../../components/animate";

const RECRUITING_TYPES = [
    { id: 0, label: 'I work for a recruitment company' },
    { id: 1, label: 'I work in Human Resources' },
];

const Container = styled(StyledContainer)(({ theme }) => ({
    [theme.breakpoints.up('sm')]: {
        padding: `${theme.spacing(12)} 0`,
    },
    [theme.breakpoints.down('sm')]: {
        padding: `${theme.spacing(12)} ${theme.spacing(4)}`,
    },
}));

const Form = styled(Box)(({ theme }) => ({
    maxWidth: '730px !important',
    backgroundColor: theme.palette.background.default,
    borderRadius: theme.shape.borderRadius * 3,
    padding: theme.spacing(8),
    [theme.breakpoints.down('sm')]: {
        padding: theme.spacing(4),
    },
    [theme.breakpoints.up('sm')]: {
        margin: `${theme.spacing(5.75)} 0`,
    },
}));

const SoundUpIcon = styled(SoundIconAnimate)(({ theme }) => ({
    borderRadius: 66.675,
    border: `${theme.spacing(0.5)} solid ${theme.palette.primary.lighter}`,
    backgroundColor: theme.palette.primary.light,
    marginLeft: theme.spacing(1),
    color: theme.palette.common.white,
    width: 32,
    height: 32,
    padding: theme.spacing(0.5),
    '& > span': {
        lineHeight: 1,
    },
    '& > span:first-child': {
        left: '2.6px !important',
    },
    '& svg': {
        fontSize: 16,
    },
}));

const StyledFormControl = styled(FormControl)(({ theme }) => ({
    width: '100%',
    '& > .MuiFormGroup-root': {
        marginLeft: theme.spacing(-2),
        justifyContent: 'space-between',
        '& > .MuiFormControlLabel-root': {
            '& .MuiFormControlLabel-label ': {
                fontSize: 16,
            },
            '& .MuiButtonBase-root.MuiRadio-root': {
                padding: 13.5,
            },
            '& .MuiSvgIcon-root': {
                fontSize: 30,
            },
        }
    },
}));

export default ({methods, selectedAssistant, isActive = false}) => {
    const { handleSubmit, setValue, getValues, watch, formState: { isSubmitting } } = methods;

    const { push } = useRouter();

    const [countries, setCountries] = useState(null);
    const [states, setStates] = useState([]);
    const [cities, setCities] = useState([]);
    const [showCompanyDetails, setShowCompanyDetails] = useState(false);
    const [recruitmentType, setRecruitmentType] = useState(RECRUITING_TYPES[0].id);

    const watchCountry = watch('country');
    const watchState = watch('state');

    useEffect(() => {
        fetchCountries().then((resp) => setCountries(resp));
    }, []);

    useEffect(() => {
        if (isNil(watchCountry?.id)) {
            setStates([]);
            return;
        }

        fetchStates(watchCountry.id).then((resp) => setStates(resp));
    }, [watchCountry]);

    useEffect(() => {
        if (isNil(watchState?.id)) {
            setCities([]);
            return;
        }

        fetchCities(watchState.id).then((resp) => setCities(resp));
    }, [watchState]);

    const onFetchCompanyDetails = async (data) => {
        if (!data.websiteUrl || showCompanyDetails) {
            return;
        }

        try {
            const resp = await getCompanyDetails({url: data.websiteUrl});
            const selectedCountry = countries.find(({name}) => name === resp?.country) || resp?.country;
            let selectedState = resp?.state;
            if (!isNil(selectedCountry?.id)) {
                const stateData = await fetchStates(selectedCountry.id);
                selectedState = stateData.find(({name}) => name === resp?.state);
            }
            setValue('name', resp?.company_name);
            setValue('phone', resp?.phone);
            setValue('country', selectedCountry);
            setValue('state', selectedState);
            setValue('city', resp?.city);
            setValue('streetAddress', resp?.street);
            setValue('zipcode', resp?.zipcode);
        } catch (err) {
            console.error('failed to fetch data', err);
        }
        setShowCompanyDetails(true);
    };

    const onSubmit = async (data) => {
        try {
            await Promise.all([
                postCompanyDetails({
                    url: data.websiteUrl,
                    name: data.name,
                    phone: data.phone,
                    country: data.country?.name || data.country || '',
                    state: data.state?.name || data.state || '',
                    city: data.city,
                    street: data.streetAddress,
                    zipcode: data.zipcode,
                    recruitmentType,
                }),
                postAssistantId(selectedAssistant.id),
            ]);
            push(PATH_DASHBOARD.hrHelper.root);
        } catch (err) {
            console.error(err, 'failed to submit data');
        }
    };

    const fetchCountries = async () => {
        try {
            const resp = await AIGetAPIRequest(API_GET_COUNTRIES);
            return resp;
        } catch (err) {
            console.error(err, 'failed to fetch countries');
        }

        return [];
    };

    const fetchStates = async (countryId) => {
        try {
            const resp = await AIGetAPIRequest(`${API_GET_STATES}?country_id=${countryId}`);
            return resp;
        } catch (err) {
            console.error(err, 'failed to fetch states');
        }

        return [];
    };

    const fetchCities = async (stateId) => {
        try {
            const resp = await AIGetAPIRequest(`${API_GET_CITIES}?state_id=${stateId}`);
            return resp.map(({name}) => name);
        } catch (err) {
            console.error(err, 'failed to fetch cities');
        }

        return [];
    };

    const onCountryChanged = async (_, value) => {
        const currentValues = getValues();
        if (value?.id !== currentValues.country?.id) {
            setValue('country', value);
            setValue('state', '');
            setValue('city', '');
        }
    };

    const onStateChanged = (_, value) => {
        const currentValues = getValues();
        if (value?.id !== currentValues.state?.id) {
            setValue('state', value);
            setValue('city', '');
        }
    };

    return (
        <Section>
            <Container id={MAIN_SECTION_COMPONENT_ID}>
                <Stack flexDirection={'column'} gap={{ xs: 4 }} alignItems="center" justifyContent="center">
                    <StyledTypography variant="h2">
                        Help Zeli get to know you
                    </StyledTypography>
                    <StyledTypography variant="subtitle1">
                        To provide you with the best experience possible, tell Zeli more about who you are
                    </StyledTypography>

                    {!!countries &&
                        <Form>
                            <Stack flexDirection={'column'} gap={{ xs: 4 }} alignItems="center" justifyContent="center">
                                <Grid container spacing={4}>
                                    <Grid item xs={12} sm="auto">
                                        <Stack flexDirection={'column'} alignItems="center" justifyContent="center">
                                            <AvatarSelector
                                                id={'desktop-avatar'}
                                                assistant={selectedAssistant}
                                                step={2}
                                                selected
                                                style={{width: '200px', height: '200px'}}
                                                className="lighter-border"
                                                play={isActive}
                                            />
                                            <CenterBox sx={{ flexDirection: 'row', mt: 1.25 }}>
                                                <StyledTypography variant="caption" component="span">Turn up your sound</StyledTypography>
                                                <SoundUpIcon />
                                            </CenterBox>
                                        </Stack>
                                    </Grid>
                                    <Grid item xs={12} sm>
                                        <Stack flexDirection="row" alignItems="center" mb={2}>
                                            <StyledTypography variant="h4">
                                                {selectedAssistant?.avatarName ?? 'Zeli'}
                                            </StyledTypography>
                                            <StyledTypography variant="subtitle2" sx={{ marginLeft: '11px' }}>
                                                {selectedAssistant?.avatarRole ?? 'HR Specialist in Recruitment and Talent Acquisition'}
                                            </StyledTypography>
                                        </Stack>
                                        <StyledTypography sx={{
                                            padding: (theme) => `${theme.spacing(1)} ${theme.spacing(2)}`,
                                            border: '1px solid',
                                            borderColor: "primary.darker",
                                            borderRadius: (theme) => theme.spacing(2),
                                            borderTopLeftRadius: 0,
                                        }}>
                                            {selectedAssistant?.dialogueText2 ?? 'Welcome to Zeligate! Help me learn about your company, department and hiring process by sharing any relevant files. That way I can help you better. Documents like job requisitions, position descriptions and offer letters, are a great start. You can always upload more later.'}
                                        </StyledTypography>
                                    </Grid>
                                </Grid>

                                <FormProvider {...methods}>
                                    <Grid container spacing={1.5}>
                                        <Grid item xs={12} sm={12}>
                                            <form onSubmit={handleSubmit(onFetchCompanyDetails)}>
                                                <RHFTextField name='websiteUrl' label="Your company website" placeHolder='https://' />
                                            </form>
                                        </Grid>
                                        {showCompanyDetails &&
                                            <>
                                                <Grid item xs={12} sm={6}>
                                                    <RHFTextField name='name' label='Company name' placeHolder='Company name' />
                                                </Grid>
                                                <Grid item xs={12} sm={6}>
                                                    <RHFTextField name='phone' label='Company Phone number' placeHolder='+88 888 888 888' type={'tel'} />
                                                </Grid>
                                                <Grid item xs={12} sm={4}>
                                                    <StyledSelect
                                                        options={countries}
                                                        renderOption={(props, option) => {
                                                            return (
                                                                <li {...props} key={`country-${option.id}`}>
                                                                    {option.name}
                                                                </li>
                                                            );
                                                        }}
                                                        isOptionEqualToValue={(option, value) => (option.id ? option.id === value : value === '')}
                                                        getOptionLabel={(option) => option.name ?? option}
                                                        renderInput={(params) => <StyledTextField label="Country" {...params} />}
                                                        label="Country"
                                                        name="country"
                                                        autoSelect
                                                        autoHighlight
                                                        onChange={onCountryChanged}
                                                    />
                                                </Grid>
                                                <Grid item xs={12} sm={4}>
                                                    <StyledSelect
                                                        options={states}
                                                        renderOption={(props, option) => {
                                                            return (
                                                                <li {...props} key={`state-${option.id}`}>
                                                                    {option.name}
                                                                </li>
                                                            );
                                                        }}
                                                        isOptionEqualToValue={(option, value) => (option.id ? option.id === value : value === '')}
                                                        getOptionLabel={(option) => option.name ?? option}
                                                        renderInput={(params) => <StyledTextField label="State/Region" {...params} />}
                                                        label="State/Region"
                                                        name="state"
                                                        autoSelect
                                                        autoHighlight
                                                        onChange={onStateChanged}
                                                    />
                                                </Grid>
                                                <Grid item xs={12} sm={4}>
                                                    <StyledSelect
                                                        options={cities}
                                                        renderOption={(props, option) => {
                                                            return (
                                                                <li {...props} key={`city-${option}`}>
                                                                    {option}
                                                                </li>
                                                            );
                                                        }}
                                                        isOptionEqualToValue={(option, value) => option === value}
                                                        renderInput={(params) => <StyledTextField label="City" {...params} />}
                                                        label="City"
                                                        name='city'
                                                        autoSelect
                                                        autoHighlight
                                                    />
                                                </Grid>
                                                <Grid item xs={12} sm={6}>
                                                    <RHFTextField name='streetAddress' label='Street address' placeHolder='Street' />
                                                </Grid>
                                                <Grid item xs={12} sm={6}>
                                                    <RHFTextField name='zipcode' label='Zip/Code' placeHolder='Zip/Code' />
                                                </Grid>
                                            </>
                                        }
                                    </Grid>
                                </FormProvider>

                                {!showCompanyDetails &&
                                    <CenterBox sx={{ flexDirection: 'row', width: '100%', justifyContent: 'space-between' }}>
                                        <LoadingButton color='primary' variant='outlined' onClick={() => setShowCompanyDetails(true)}>
                                            <span style={{ textTransform: 'none' }}>{`I don't have a website`}</span>
                                        </LoadingButton>
                                        <LoadingButton color='primary' variant='contained' loading={isSubmitting} onClick={handleSubmit(onFetchCompanyDetails)}>
                                            <span style={{ textTransform: 'none' }}>Fetch</span>
                                        </LoadingButton>
                                    </CenterBox>
                                }

                                <StyledFormControl component="fieldset">
                                    <RadioGroup
                                        aria-label='Recruiting Type'
                                        value={recruitmentType}
                                        onChange={(event) => setRecruitmentType(event.target.value)}
                                        row
                                    >
                                        {RECRUITING_TYPES.map(
                                            ({id, label}) => (
                                                <FormControlLabel
                                                    key={`recruitingType-key-${id}`}
                                                    value={id}
                                                    control={<Radio sx={{ color: 'primary.main' }} />}
                                                    label={label}
                                                    labelPlacement="start"
                                                />
                                            )
                                        )}
                                    </RadioGroup>
                                </StyledFormControl>

                                <DocumentType />

                                <UploadFiles disabledFeedback />
                            </Stack>
                        </Form>
                    }

                    {showCompanyDetails &&
                        <CenterBox>
                            <LoadingButton variant='contained' loading={isSubmitting} sx={{
                                border: '1px solid white',
                                background: '#170058',
                            }} onClick={handleSubmit(onSubmit)}>
                                <span style={{ textTransform: 'none' }}>Continue</span>
                            </LoadingButton>
                        </CenterBox>
                    }
                </Stack>
            </Container>
        </Section>
    );
};
