import {useCallback, useEffect, useState} from 'react';
import {useForm} from 'react-hook-form';
import {yupResolver} from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import {isNil} from "lodash";
import {Alert, FormControl, FormControlLabel, Grid, Radio, RadioGroup, Stack, styled, Typography} from '@mui/material';
import {useSnackbar} from 'notistack';

import {useAuthContext} from '../../../../auth/context/useAuthContext';
import {fData} from '../../../../../utils/formatNumber';
import FormProvider, {RHFTextField, RHFUploadAvatar} from '../../../../../components/hook-form';
import {getUserProfile, updateProfileFields, WEBSITE_REGEX} from '../../../../../constants';
import {fileDropzoneProps, getImageFromS3} from '../../../../../constants/upload';
import {StyledButton, StyledLoadingButton} from './AccountStyles';
import {StyledSelect, StyledTextField} from "../../../../ai-worker/components/output-card/cards/CardStyles";
import {AIGetAPIRequest} from "../../../../ai-worker/constants";
import {API_GET_CITIES, API_GET_COUNTRIES, API_GET_STATES} from "../../../../../config-global";
// ----------------------------------------------------------------------
// All rights reserved - SEDZ PTY LTD - 2023
// ----------------------------------------------------------------------

const UploadImageCaption = styled(Typography)(({ theme }) => ({
	marginTop: theme.spacing(2),
	textAlign: 'center',
	color: theme.palette.grey[500],
	fontSize: 12,
	fontWeight: 500,
	lineHeight: 1.67,
	letterSpacing: 0.14,
	padding: `${theme.spacing(1)} 0`,
}));

export default function AccountGeneral({ onClose }) {
	const {enqueueSnackbar} = useSnackbar();
	const {user, updateProfile} = useAuthContext();
	const [loading, setLoading] = useState(true);
	const [profileImage, setProfileImage] = useState(null);
	const [countries, setCountries] = useState([]);
	const [states, setStates] = useState([]);
	const [cities, setCities] = useState([]);
	const [isFullNameRequired, setFullNameRequired] = useState(false);

	const [recruitingType, setRecruitingType] = useState(null);
	const recruitingTypes = [
		{ id: 0, label: 'I work in a recruitment company, hiring for different clients' },
		{ id: 1, label: 'I am in Human Resources, hiring for the company I work for' },
	];

	const UpdateUserSchema = Yup.object().shape({
		fullName: isFullNameRequired ? Yup.string().required('Your Name is required') : Yup.string(),
		email: Yup.string().required('Email is required').email('Email must be a valid email address'),
		companyDetails: Yup.object().shape({
			url: Yup.string().matches(
				WEBSITE_REGEX,
				{
					message: 'Your company website must be a valid URL',
					excludeEmptyString: true,
				},
			),
		}),
	});

	const defaultValues = {
		country: '',
		state: '',
		recruitmentType: 0,
		fullName: '',
		email: '',
		phoneNumber: '',
		companyDetails: {
			name: '',
			address: {
				streetAddress: '',
				country: '',
				stateName: '',
				city: '',
				postCode: '',
			},
			phone: '',
			url: '',
		},
		about: '',
		photoURL: '',
	};

	const methods = useForm({
		resolver: yupResolver(UpdateUserSchema),
		defaultValues,
	});

	const {
		getValues,
		setValue,
		setError,
		handleSubmit,
		watch,
		formState: { isSubmitting, errors },
	} = methods;

	const watchCountry = watch('country');
	const watchState = watch('state');

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

	useEffect(() => {
		fetchCountries().then(async (countriesResp) => {
			const userProfileResp = await getUserProfile();
			const userProfile = userProfileResp?.data?.[0] || {};
			setCountries(countriesResp);
			setFullNameRequired(!!userProfile?.fullName);
			const selectedCountry = countries.find(({name}) => name === userProfile?.companyDetails?.address?.country)
				|| userProfile?.companyDetails?.address?.country
				|| defaultValues.companyDetails.address.country;
			let selectedState = userProfile?.companyDetails?.address?.stateName
				|| defaultValues.companyDetails.address.stateName;
			if (!isNil(selectedCountry?.id)) {
				const stateData = await fetchStates(selectedCountry.id);
				selectedState = stateData.find(({name}) => name === userProfile?.companyDetails?.address?.stateName);
			}

			if (userProfile?.photoURL) {
				setProfileImage(userProfile?.photoURL);
				getImageFromS3(userProfile?.photoURL).then((image) => {
					setValue('photoURL', image);
				});
			}

			setRecruitingType(userProfile?.recruitmentType);
			setValue('fullName', userProfile?.fullName || defaultValues.fullName);
			setValue('email', userProfile?.email || defaultValues.email);
			setValue('phoneNumber', userProfile?.phoneNumber || defaultValues.phoneNumber);
			setValue('companyDetails.url', userProfile?.companyDetails?.url || defaultValues.companyDetails.url);
			setValue('companyDetails.name', userProfile?.companyDetails?.name || defaultValues.companyDetails.name);
			setValue('companyDetails.phone', userProfile?.companyDetails?.phone || defaultValues.companyDetails.phone);
			setValue('companyDetails.address.country', userProfile?.companyDetails?.address?.country || defaultValues.companyDetails.address.country);
			setValue('companyDetails.address.stateName', userProfile?.companyDetails?.address?.stateName || defaultValues.companyDetails.address.stateName);
			setValue('companyDetails.address.city', userProfile?.companyDetails?.address?.city || defaultValues.companyDetails.address.city);
			setValue('companyDetails.address.postCode', userProfile?.companyDetails?.address?.postCode || defaultValues.companyDetails.address.postCode);
			setValue('companyDetails.address.streetAddress', userProfile?.companyDetails?.address?.streetAddress || defaultValues.companyDetails.address.streetAddress);
			setValue('about', userProfile?.about || defaultValues.about);
			setValue('country', selectedCountry);
			setValue('state', selectedState);
		}).catch((error) => {
			console.error('error: ', error);
			enqueueSnackbar('Error loading profile fields', { variant: 'error' });
		}).then(() => setLoading(false));
	}, [setValue, setLoading]);

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

	const onCountryChanged = (_, value) => {
		const currentValues = getValues();
		if (value?.id !== currentValues.country?.id) {
			setValue('country', value);
			setValue('state', '');
			setValue('companyDetails.address.city', '');
		}
	};

	const onStateChanged = (_, value) => {
		const currentValues = getValues();
		if (value?.id !== currentValues.state?.id) {
			setValue('state', value);
			setValue('companyDetails.address.city', '');
		}
	};

	const onSubmit = async ({country, state, ...data}) => {
		// swap the image back to the url
		if (data.photoURL) {
			data.photoURL = profileImage;
		}
		try {
			data.companyDetails.address.country = country?.name || country || '';
			data.companyDetails.address.stateName = state?.name || state || '';
			await updateProfile(data.fullName);
			await updateProfileFields(data);
			await enqueueSnackbar('Update success!');
			onClose();
		} catch (error) {
			setError('afterSubmit', {
				...error,
				message: error.message || error,
			});
		}
	};

	const handleProfileDrop = useCallback(
		(acceptedFiles) => {
			const file = acceptedFiles[0];
			const acceptedFileTypes = ['image/jpeg', 'image/png', 'image/gif'];
			const maxFileSize = 5242880; // 5MB

			if (file && file.size > maxFileSize) {
				return;
			}
		},
		[setValue]
	);

	const onRadioClick = (id) => {
		setRecruitingType(id);
		setValue('recruitmentType', id);
	}

	return (
		<FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
			{!!errors.afterSubmit && <Alert severity='error'>{errors.afterSubmit.message}</Alert>}
			<Grid container spacing={2}>
				<Grid item container xs={12} sm spacing={1.5}>
					<Grid item xs={12}>
						<FormControl component="fieldset" sx={{ width: '100%' }}>
							<RadioGroup
								aria-label='recruitingType'
								name='recruitmentType'
								value={recruitingType}
								onChange={(event) => onRadioClick(event.target.value)}
								row
							>
								{recruitingTypes?.map((item) => (
									<FormControlLabel
										key={item.id}
										value={item.id}
										control={<Radio sx={{ color: 'primary.main' }} />}
										label={item.label}
										labelPlacement="end"
									/>
								))}
							</RadioGroup>
						</FormControl>
					</Grid>
					<Grid item xs={12}>
						<RHFTextField name='fullName' label={`Your name${isFullNameRequired ? ' *' : ''}`} placeHolder='First Lastname' />
					</Grid>
					<Grid
						item
						columnGap={2}
						display='grid'
						gridTemplateColumns={{
							xs: 'repeat(1, 1fr)',
							sm: 'repeat(2, 1fr)',
						}}
						xs={12}
						mb={2}
					>
						<RHFTextField name='email' label='Email Address *' placeHolder='Email Address' />
						<RHFTextField name='phoneNumber' label='Phone Number' placeHolder='+88 888 888 888' type={'tel'} />
					</Grid>
					<Grid item xs={12}>
						<Typography sx={{ fontWeight: 600, fontSize: 16 }}>Company details</Typography>
					</Grid>
					<Grid item xs={12}>
						<RHFTextField name='companyDetails.url' label="Your company website" placeHolder='https://' />
					</Grid>
					<Grid
						item
						display='grid'
						columnGap={2}
						gridTemplateColumns={{
							xs: 'repeat(1, 1fr)',
							sm: 'repeat(2, 1fr)',
						}}
						xs={12}
					>
						<RHFTextField name='companyDetails.name' label='Company name' placeHolder='Company name' />
						<RHFTextField name='companyDetails.phone' label='Company Phone number' placeHolder='+88 888 888 888' type={'tel'} />
					</Grid>
					<Grid
						item
						columnGap={2}
						display='grid'
						gridTemplateColumns={{
							xs: 'repeat(1, 1fr)',
							sm: 'repeat(3, 1fr)',
						}}
						xs={12}
					>
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
							name='companyDetails.address.city'
							autoSelect
							autoHighlight
						/>
					</Grid>
					<Grid
						item
						columnGap={2}
						display='grid'
						gridTemplateColumns={{
							xs: 'repeat(1, 1fr)',
							sm: 'repeat(2, 1fr)',
						}}
						xs={12}
					>
						<RHFTextField name='companyDetails.address.streetAddress' label='Street address' placeHolder='Street' />
						<RHFTextField name='companyDetails.address.postCode' label='Zip/Code' placeHolder='Zip/Code' />
					</Grid>
					<Grid item xs={12}>
						<RHFTextField name='about' multiline rows={2} label='About' />
					</Grid>
				</Grid>
				<Grid item container xs={12} sm="auto" justifyContent="center">
					<RHFUploadAvatar
						name='photoURL'
						maxSize={5242880}
						onDrop={handleProfileDrop}
						helperText={
							<UploadImageCaption>
								Use .jpeg, .jpg, .png, .gif max size of {fData(5242880)}
							</UploadImageCaption>
						}
						{...fileDropzoneProps}
					/>
				</Grid>
				<Grid item xs={12}>
					<Stack gap={3} direction='row' justifyContent='flex-end'>
						<StyledButton variant='outlined' color='primary' onClick={onClose}>
							Cancel
						</StyledButton>
						<StyledLoadingButton type='submit' variant='contained' color='primary' loading={isSubmitting} disabled={loading}>
							Save
						</StyledLoadingButton>
					</Stack>
				</Grid>
			</Grid>
		</FormProvider>
	);
}
