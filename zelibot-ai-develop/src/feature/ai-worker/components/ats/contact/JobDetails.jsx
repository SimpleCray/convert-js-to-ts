import React, { useMemo } from 'react';
import { Stack, Box, Typography } from '@mui/material';
import { formatCurrency } from '../../../../../utils/formatNumber';
import Contact from './Contact';

const JobDetails = ({ info }) => {
	const locationList = useMemo(() => [info?.job_opening_location?.country?.name, info?.job_opening_location?.state?.name, info?.job_opening_location?.city?.name].filter((item) => !!item && item !== 'UNKNOWN'), [info?.job_country_name?.name, info?.job_state_name?.name, info?.job_city_name?.name]);
	return (
		<Stack gap={1}>
			<Stack direction='row' justifyContent='space-between'>
				<Stack gap={1}>
					{locationList?.length > 0 ? (
						<Box>
							<Typography variant='body1' fontWeight={600}>
								{locationList?.join(', ')}
							</Typography>
						</Box>
					) : null}
					{info?.min_salary || info?.max_salary ? (
						<Box>
							<Typography variant='body1' fontWeight={600}>{`${formatCurrency(info?.min_salary ?? 0, info?.currency_code)} - ${formatCurrency(info?.max_salary ?? 0, info?.currency_code)} (${info?.currency_code})`}</Typography>
						</Box>
					) : null}
					{info?.client_email ? (
						<Box>
							<Typography
								sx={{ '&:hover': { textDecoration: 'underline', cursor: 'pointer' } }}
								onClick={() => {
									window.open(`mailto:${email}`);
									return
								}}
								component='span'
								variant='body1'
								color={(theme) => theme.palette.primary.light}
							>
								{info?.client_email}
							</Typography>
						</Box>
					) : null}
					{info?.client_phone ? (
						<Box>
							<Typography component='span' variant='body1' color={(theme) => theme.palette.primary.light}>
								{info?.client_phone}
							</Typography>
						</Box>
					) : null}
					<Box>
						<Typography variant='body1'>
							{/* I want to generate it in such a format --> 'Amount Value - $1000 / Agency Percentage - 50%'  */}
							{info?.agency_commision_fee_value || info?.agency_commision_fee_percent
								? info?.agency_commision_fee_value && !info?.agency_commision_fee_percent
									? 'Agency fee: ' + formatCurrency(info?.agency_commision_fee_value ?? 0, info?.currency_code)
									: !info?.agency_commision_fee_value && info?.agency_commision_fee_percent
									  ? 'Agency percentage: ' + info?.agency_commision_fee_percent + '%'
									  : info?.agency_commision_fee_value && info?.agency_commision_fee_percent
									    ? 'Agency fees: ' + formatCurrency(info?.agency_commision_fee_value ?? 0, info?.currency_code) + ' + ' + info?.agency_commision_fee_percent + '%'
									    : null
								: null}
						</Typography>
					</Box>
				</Stack>
				{info?.client_email || info?.client_phone ? <Contact title='Contact' email={info?.client_email} phone={info?.client_phone} /> : null}
			</Stack>
			{info?.summary ? <>{info?.summary}</> : null}
		</Stack>
	);
};

export default JobDetails;
