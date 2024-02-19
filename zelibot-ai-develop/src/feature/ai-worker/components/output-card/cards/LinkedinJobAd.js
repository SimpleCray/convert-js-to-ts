import { useForm } from 'react-hook-form';
import CardHeader from '@mui/material/CardHeader';
import { useTheme } from '@mui/material/styles';
import { TextareaAutosize } from '@mui/base/TextareaAutosize';
import NewspaperIcon from '@mui/icons-material/Newspaper';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import PersonIcon from '@mui/icons-material/Person';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import { useAuthContext } from 'src/feature/auth/context/useAuthContext';
import OutputCard from '../OutputCard';
import { Avatar, Card, CardContent, CardActions, Button, Typography, Grid, Snackbar, Alert, Box, Link, Stack } from '@mui/material';
import { StyledBox, StyledCardActions, StyledCardContent, StyledTextArea } from '../OutputCardStyles';
import { useEffect, useState } from 'react';
import { StyledButton } from './CardStyles';
import { JobAdAvatar } from '../ATSCardSytles';


export default function LinkedinJobAdOutputCard({ title, body, data, ...props }) {
	const { user } = useAuthContext();
	const theme = useTheme();
	const [txtAreaValue, setTxtAreaValue] = useState('');
	const [showSnackbar, setShowSnackabar] = useState(false);
	const [edit, setEdit] = useState(false);
	const { register, handleSubmit } = useForm();
	// const LINKEDIN_LINK = 'https://www.linkedin.com/shareArticle?mini=true&url=https://www.zeligate.ai/';
	const LINKEDIN_LINK = 'https://www.linkedin.com/shareArticle?mini=true';

	const handleEdit = () => {
		const linkedInAd = document.getElementById('linkedInAd').innerText;
		setTxtAreaValue(linkedInAd);
		setEdit(true);
	};
	const onSubmit = (data) => {
		setEdit(false);
	};
	const handlePostLinkedIn = () => {
		// const linkedInAd = document.getElementById('linkedInAd');
		// navigator.clipboard.writeText(txtAreaValue)
		// 	.then(() => {
		// 		console.log('Copied to clipboard!');
		// 	})
		// 	.catch((error) => {
		// 		console.error('Failed to copy: ', error);
		// 	});
		// console.log('copied to clipboard... done');
		setShowSnackabar(true);

		// Open LinkedIn in a new tab
		const linkedInUrl = 'https://www.linkedin.com/feed/?shareActive=true';
		copyToClipboard().then(r => window.open(linkedInUrl, '_blank'))
		// window.open(linkedInUrl, '_blank');
		// window.open(LINKEDIN_LINK, '_blank');
	};
	const handleChange = (event) => {
		setTxtAreaValue(event.target.value);
	};

	const handleClose = (event, reason) => {
		if (reason === 'clickaway') {
			return;
		}
		setShowSnackabar(false);
	};

	useEffect(() => {
		setTxtAreaValue(body);
	}, [body]);

	// temp values
	const jobTitle = '';
	const company = '';

	const formattedBody = () => {
		return (
			<Typography variant='body1' component={'div'} sx={{ mb: 2 }}>
				{txtAreaValue && txtAreaValue.includes('\n')
					? txtAreaValue.split('\n').map((paragraph, index) => {
							const words = paragraph.split(' ');
							const tags = words.filter((w) => w.indexOf('#') === 0);
							if (words.length === 1 && words[0] === '') {
								return;
							}
							return (
								<Typography gutterBottom>
									{words.map((w, i) => {
										const isHashtag = tags.find((t) => t === w);
										return (
											<Typography component='span' key={i} sx={{ ...(isHashtag && { color: theme.palette.primary.light }) }} variant='body1'>
												{w}{' '}
											</Typography>
										);
									})}
								</Typography>
							);

							// return (
							// 	<Typography key={index} variant='body1' gutterBottom>
							// 		{paragraph}
							// 	</Typography>
							// );
						})
					: txtAreaValue}
			</Typography>
		);
	};

	const buildTitle = (data) => {
		let titleParts = [];
		if (data.job_title) {
			titleParts.push(`for ${data.job_title}`);
		}
		if (data.client_name) {
			titleParts.push(`for ${data.client_name}`);
		}
		// console.log('#116 titleParts', titleParts)
		return titleParts.join(' ');
	}



	const copyToClipboard = async () => {
		try {
			await navigator.clipboard.writeText(txtAreaValue);
		} catch (err) {
		}
	};


		return (
		<OutputCard
			title={
				<Stack direction='row'>
					<Typography>Job Ad {buildTitle(data)}</Typography>
					<Typography sx={{ color: (theme) => theme.palette.primary.light }}>
						{jobTitle} {company}
					</Typography>
				</Stack>
			}
			isATSCard
			titleIcon={<NewspaperIcon />}
			{...props}
		>
			<Card variant='outlined' color={'grey.600'} sx={{ display: 'flex', flexDirection: 'column', margin: '10px auto', width: '100%', boxShadow: 'unset' }}>
				{/* <CardHeader avatar={<Avatar src={'/assets/images/eric-smith.png'} />} title={'[Job Title]'} subheader={'[Company Name]'}></CardHeader> */}
				{/* <CardHeader
					avatar={
						// <Box sx={{ background: (theme) => theme.palette.grey[400], borderRadius: '50%', display: 'flex', justifyContent: 'center', alignItems: 'center', width: (theme) => theme.spacing(5), height: (theme) => theme.spacing(5) }}>
						// 	<PersonIcon color='white' />
						// </Box>
						<JobAdAvatar>
							<PersonIcon />
						</JobAdAvatar>
					}
					title={user.displayName || ''}
				></CardHeader> */}
				{/* <Stack direction='row' justifyContent='space-between' alignItems='center' padding={4} paddingBottom={0}>
					 <JobAdAvatar>
						  <PersonIcon /> TODO - after integrade linkedin Databse we can import profile pic later 
					</JobAdAvatar>
					<LinkedInIcon sx={{ width: (theme) => theme.spacing(5), height: (theme) => theme.spacing(5), color: '#2867b2' }} />
				</Stack> */}
				<StyledCardContent>
					{/* if in edit mode, show the textarea */}
					{edit && (
						<Grid container display={'flex'} flexDirection={'column'} justifyContent={'center'}>
							<form onSubmit={handleSubmit(onSubmit)}>
								<StyledTextArea>
									<TextareaAutosize id={'textArea'} value={txtAreaValue} minRows={12} {...register('textArea')} onChange={handleChange} />
									<Grid container display={'flex'} justifyContent={'flex-start'}>
										<StyledButton variant={'outlined'} color={'secondary'} onClick={() => setEdit(false)}>
											Cancel
										</StyledButton>
										<StyledButton variant={'contained'} color='primary' type='submit'>
											Save
										</StyledButton>
									</Grid>
								</StyledTextArea>
							</form>
						</Grid>
					)}
					<CardContent sx={{ padding: 0 }}>
						<Typography color={'grey.600'} id={'linkedInAd'} variant={'body1'} gutterBottom>
							{/*{txtAreaValue}*/}
							{formattedBody()}
						</Typography>
					</CardContent>
				</StyledCardContent>
			</Card>
			<StyledCardActions>
				<CardActions sx={{ display: 'flex', justifyContent: 'space-between', width: '100%', padding: '0' }}>
					<Grid container display={'flex'} p={0}>
						<Grid item xs={12} md={6} display={'flex'} justifyContent={'flex-start'}>
							<Button onClick={handleEdit} href={'#textArea'}>
								<EditOutlinedIcon />
							</Button>
						</Grid>
						<Grid item xs={12} md={6} display={'flex'} justifyContent={'flex-end'}>
							<StyledButton variant={'contained'} color={'primary'} onClick={handlePostLinkedIn}>
								Copy and go to LinkedIn&nbsp;
								<ChevronRightIcon />
							</StyledButton>
						</Grid>
					</Grid>
					{/*<Snackbar sx={{ marginBottom: '10px' }} open={showSnackbar} autoHideDuration={15000} onClose={handleClose}>*/}
					{/*	<Alert severity='success' sx={{ width: '100%' }}>*/}
					{/*		Text copied to clipboard! Paste it into a new post on your&nbsp;*/}
					{/*		<Link href={LINKEDIN_LINK} target={'_blank'} sx={{ textDecoration: 'underline' }}>*/}
					{/*			LinkedIn account*/}
					{/*		</Link>*/}
					{/*	</Alert>*/}
					{/*</Snackbar>*/}
				</CardActions>
			</StyledCardActions>
		</OutputCard>
	);
}
