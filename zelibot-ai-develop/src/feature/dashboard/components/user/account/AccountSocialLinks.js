import {useEffect, useState} from 'react';
import {useForm} from 'react-hook-form';
import {Grid, Stack, styled} from '@mui/material';
import {Iconify} from '@zelibot/zeligate-ui';
import {useSnackbar} from 'notistack';

import FormProvider, {RHFTextField} from '../../../../../components/hook-form';
import {getUserProfile, updateProfileFields} from '../../../../../constants';
import {StyledButton, StyledLoadingButton, StyledTypography} from "./AccountStyles";

// ----------------------------------------------------------------------
// All rights reserved - SEDZ PTY LTD - 2023
// ----------------------------------------------------------------------

const StyledIconify = styled(Iconify)(({ theme }) => ({
	fontSize: 32,
	width: 40,
	height: 40,
	color: theme.palette.grey[600]
}));

const SOCIAL_LINKS = [
	{
		value: 'linkedinLink',
		icon: <StyledIconify icon="ant-design:linkedin-filled" />,
		placeHolder: 'LinkedIn',
	},
	{
		value: 'twitterLink',
		icon: <StyledIconify icon="fa6-brands:square-x-twitter" />,
		placeHolder: 'X',
	},
	{
		value: 'facebookLink',
		icon: <StyledIconify icon="fa-brands:facebook-square" />,
		placeHolder: 'Facebook',
	},
	{
		value: 'instagramLink',
		icon: <StyledIconify icon="ant-design:instagram-filled" />,
		placeHolder: 'Instagram',
	},
];

// ----------------------------------------------------------------------
// All rights reserved - SEDZ PTY LTD - 2023
// ----------------------------------------------------------------------

export default function AccountSocialLinks({onClose}) {
	const { enqueueSnackbar } = useSnackbar();
	const [loading, setLoading] = useState(true);

	const defaultValues = {
		facebookLink: '',
		instagramLink: '',
		linkedinLink: '',
		twitterLink: '',
	};

	const methods = useForm({
		defaultValues,
	});

	const {
		setValue,
		setError,
		handleSubmit,
		formState: { isSubmitting, errors },
	} = methods;

	const handleProfileSocialLinks = async () => {
		await getUserProfile()
			.then((response) => {
				setValue('facebookLink', response.data[0]?.facebookLink || '');
				setValue('instagramLink', response.data[0]?.instagramLink || '');
				setValue('linkedinLink', response.data[0]?.linkedinLink || '');
				setValue('twitterLink', response.data[0]?.twitterLink || '');
			})
			.catch((error) => {
				console.error('error: ', error);
				enqueueSnackbar('Error loading profile fields', { variant: 'error' });
			}).then(() => setLoading(false));
	};

	useEffect(() => {
		void handleProfileSocialLinks();
	}, [setValue, setLoading]);

	const onSubmit = async (data) => {
		try {
			await updateProfileFields(data);
			await enqueueSnackbar('Update success!');
		} catch (error) {
			setError('afterSubmit', {
				...error,
				message: error.message || error,
			});
		}
	};

	return (
		<FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
			<Stack gap={5}>
				<StyledTypography>
					It's up to you how many social links you would like to add.
				</StyledTypography>

				<Grid container spacing={2} sx={{ width: 604 }}>
					{SOCIAL_LINKS.map((link) => (
						<Grid
							key={link.value}
							item
							display='grid'
							columnGap={2}
							gridTemplateColumns={{
								xs: 'repeat(1, auto 1fr)',
							}}
							alignItems="center"
							xs={12}
						>
							{link.icon}
							<RHFTextField name={link.value} placeHolder={link.placeHolder} />
						</Grid>
					))}
				</Grid>

				<Stack gap={3} direction='row' justifyContent='flex-end'>
					<StyledButton variant='outlined' color='primary' onClick={onClose}>
						Cancel
					</StyledButton>
					<StyledLoadingButton type='submit' variant='contained' color='primary' loading={isSubmitting} disabled={loading}>
						Save
					</StyledLoadingButton>
				</Stack>
			</Stack>
		</FormProvider>
	);
}
