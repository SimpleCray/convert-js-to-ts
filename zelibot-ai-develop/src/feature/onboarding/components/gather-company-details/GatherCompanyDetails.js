import { Stack } from '@mui/material';
import { useState } from 'react';
import { useTheme } from '@mui/material/styles';

import { getCompanyDetails, postCompanyDetails, websiteSchema } from '../../../../constants';
import useResponsive from '../../../../hooks/useResponsive';
import { ContinueButton, SkipButton, Heading, Description, FormItem, Form, Spacer } from './GatherCompanyDetailsStyles';

export default function GatherCompanyDetails({ onComplete }) {
	const [formState, setFormState] = useState('setUrl');
	const [isLoading, setIsLoading] = useState(false);
	const [companyName, setCompanyName] = useState('');
	const [companyAddress, setCompanyAddress] = useState('');
	const [companyPhone, setCompanyPhone] = useState('');
	const [error, setError] = useState();
	const [url, setUrl] = useState('');
	const [urlError, setUrlError] = useState();

	const isDesktop = useResponsive('up', 'md');
	const theme = useTheme();
	const sp = theme.spacing;

	const formStates = {
		setUrl: {
			text: 'So that Zeli can provide you with the best help possible, tell them more about who you are',
			onContinue: async (e) => {
				try {
					websiteSchema.validateSync(url);
				} catch (err) {
					setUrlError(err);
					return;
				}

				setUrlError(undefined);
				setError(undefined);
				const { company_name: companyName, company_address: companyAddress, company_phone: companyPhone } = await getCompanyDetails({ url });
				setCompanyName(companyName);
				setCompanyAddress(companyAddress);
				setCompanyPhone(companyPhone);
				setFormState('confirmDetails');
			},
			skip: () => {
				setUrl('');
				setUrlError(undefined);
				setError(undefined);
				setFormState('confirmDetails');
			},
		},
		confirmDetails: {
			text: 'Please confirm the details below are correct',
			onContinue: async () => {
				try {
					websiteSchema.validateSync(url);
				} catch (err) {
					setUrlError(err);
					return;
				}

				setUrlError(undefined);
				setError(undefined);
				await postCompanyDetails({
					name: companyName,
					address: companyAddress,
					phone: companyPhone,
					url,
				});
				setFormState('setUrl');
				onComplete();
			},
			skip: undefined,
		},
	};

	const { onContinue, text, skip } = formStates[formState];
	const onSubmit = (e) => {
		e.preventDefault();
		setIsLoading(true);
		onContinue?.()
			.then()
			.catch((error) => {
				console.error(error);
				setError(error);
				setFormState(formState);
			})
			.finally(() => {
				setIsLoading(false);
			});
	};

	return (
		<Stack
			direction='row'
			style={{
				width: '454px',
				height: 'fit-content',
				justifyContent: 'center',
				alignItems: 'center',
				gap: sp(8),
				flex: 1,
			}}
		>
			<Form
				onSubmit={onSubmit}
				style={{
					width: '454px',
					padding: sp(2),
					maxWidth: '400px',
					alignSelf: 'stretch',
					height: '100%',
				}}
			>
				<Stack direction='column' style={{ height: 'fit-content' }}>
					<Heading text='Tell Zeli about you' style={{ marginBottom: sp(1), marginTop: sp(3), marginLeft: sp(2), marginRight: sp(2) }} />
					<Description text={text} style={{ marginBottom: sp(8), marginLeft: sp(2), marginRight: sp(2) }} />
					<FormItem style={{ marginBottom: sp(3) }} error={error || urlError} disabled={isLoading} value={url} setValue={setUrl} label='Your company website' placeholder='https://' helperText={urlError?.message ?? urlError}/>
					{formState === 'confirmDetails' && <FormItem style={{ marginBottom: sp(3) }} error={error} disabled={isLoading} value={companyName} setValue={setCompanyName} label='Company name' />}
					{formState === 'confirmDetails' && <FormItem style={{ marginBottom: sp(3) }} error={error} disabled={isLoading} value={companyAddress} setValue={setCompanyAddress} label='Company address' />}
					{formState === 'confirmDetails' && <FormItem style={{ marginBottom: sp(3) }} error={error} disabled={isLoading} value={companyPhone} setValue={setCompanyPhone} label='Company phone' />}
					<ContinueButton loading={isLoading} text='Continue' type='submit' style={{ alignSelf: 'flex-end', marginTop: sp(2) }} />
					<Spacer style={{ minHeight: sp(2) }} />
					{skip && <SkipButton loading={isLoading} onClick={skip} text="I don't have a website" style={{ alignSelf: 'center' }} />}
				</Stack>
			</Form>
			{isDesktop && <img src='/assets/images/auth/auth-register-avatars.png' alt='list of avatars' />}
		</Stack>
	);
}
