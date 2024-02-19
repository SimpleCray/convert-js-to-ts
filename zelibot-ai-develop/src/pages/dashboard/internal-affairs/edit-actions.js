import { API_UPDATE_CLIENTS, APP_NAME } from "../../../config-global";
import CustomBreadcrumbs from '../../../components/custom-breadcrumbs';
import { PATH_DASHBOARD } from '../../../routes/paths';
import { Stack, Typography, Box, Container, Alert } from "@mui/material";
import { DashboardLayout } from '../../../feature/dashboard';
import { Helmet } from 'react-helmet-async';
import {
	StyledButton,
	StyledControlledTextField,
	StyledSelect, StyledTextField
} from "../../../feature/ai-worker/components/output-card/cards/CardStyles";
import FormProvider from "../../../components/hook-form";
import { useForm } from 'react-hook-form';
import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { AIPostAPIRequest } from "../../../feature/ai-worker/constants";

export default function EditActionsPage() {

	const createJobListingSchema = Yup.object().shape({
		company: Yup.string().required('Company / department name is required')
	});

	const defaultValues = {
		company: ''
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

	const onSubmit = async (data) => {
		const toSubmit = {
			client_name: data.company,
		};

		try {
			await AIPostAPIRequest(API_UPDATE_CLIENTS, toSubmit);
			// TODO: add correct success actions (once defined)
			await enqueueSnackbar('Client processed!');
			reset();
		} catch (error) {
			setError('afterSubmit', {
				...error,
				message: error.message || error,
			});
		}
	}

	return (
		<DashboardLayout>
			<Helmet>
				<title> Internal Affairs: Edit Actions | {APP_NAME}</title>
			</Helmet>

			<Container>
				<CustomBreadcrumbs heading='Edit Actions' links={[{ name: 'Internal Affairs', href: PATH_DASHBOARD.internalAffairs.root }, { name: 'Internal Affairs' }]} />
			</Container>
			<Stack direction='row' justifyContent='space-between' flexShrink={0} spacing={2} alignItems='center'>
				<FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
					<Stack>
						<Box sx={{ my: 1.5 }}>
							<StyledControlledTextField
								variant='filled'
								name='company'
								label='Company or department name'
								fullWidth
								required
							/>
						</Box>
					</Stack>
				</FormProvider>
			</Stack>
		</DashboardLayout>
	);
}
