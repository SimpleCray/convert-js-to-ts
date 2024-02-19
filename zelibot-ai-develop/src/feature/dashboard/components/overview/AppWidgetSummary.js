import PropTypes from 'prop-types';
// @mui
import { alpha } from '@mui/material/styles';
import { Box, Card, Typography, Stack, Button } from '@mui/material';
// utils
import { fNumber, fPercent } from '../../../../utils/formatNumber';
// components
import { Iconify } from '@zelibot/zeligate-ui';
import Chart, { useChart } from '../../../../components/chart';
import { useTheme } from '@mui/material/styles';

// ----------------------------------------------------------------------
// All rights reserved - SEDZ PTY LTD - 2023
// ----------------------------------------------------------------------

AppWidgetSummary.propTypes = {
	sx: PropTypes.object,
	chart: PropTypes.object,
	title: PropTypes.string,
	percent: PropTypes.number,
};

export default function AppWidgetSummary({ title, percent, current, subtitle, total, buttonText, buttonLink, chart, enableChart, sx, color = 'primary', chartType = 'bar', ...other }) {
	const theme = useTheme();
	const { colors, series, options } = enableChart ? chart : {};

	let chartOptions = {};

	if (chartType === 'bar') {
		chartOptions = {
			colors,
			chart: {
				sparkline: {
					enabled: true,
				},
			},
			plotOptions: {
				bar: {
					columnWidth: '68%',
					borderRadius: 2,
				},
			},
			tooltip: {
				x: { show: false },
				y: {
					formatter: (value) => fNumber(value),
					title: {
						formatter: () => '',
					},
				},
				marker: { show: false },
			},
			...options,
		};
	} else {
		chartOptions = useChart({
			colors: [theme.palette.secondary.main],
			chart: {
				sparkline: {
					enabled: true,
				},
			},
			legend: {
				show: false,
			},
			plotOptions: {
				radialBar: {
					hollow: {
						size: '78%',
					},
					track: {
						margin: 0,
					},
					dataLabels: {
						name: {
							offsetY: -10,
							show: true,
							fontSize: theme.typography.subtitle2.fontSize,
							color: theme.palette.text.secondary,
						},
						value: {
							offsetY: 0,
							color: theme.palette.common.dark,
							fontSize: theme.typography.h3.fontSize,
							formatter: (value) => fNumber(value),
						},
						total: {
							formatter: function (w) {
								return (
									w.globals.seriesTotals.reduce((a, b) => {
										return a + b;
									}, 0) /
										w.globals.series.length +
									'%'
								);
							},
						},
					},
				},
			},
			fill: {
				type: 'gradient',
				gradient: {
					shade: 'dark',
					type: 'vertical',
					gradientToColors: [theme.palette.primary.main],
					stops: [0, 100],
					opacityFrom: 1,
					opacityTo: 1,
				},
			},
			stroke: {
				lineCap: 'round',
			},
			...options,
		});
	}

	return (
		<Card sx={{ height: '100%', display: 'flex', flexDirection: chartType !== 'bar' && { xs: 'column', sm: 'row' }, p: 3, ...sx }} {...other}>
			<Box sx={{ display: 'flex', flexGrow: 1, alignItems: { xs: 'center', sm: 'initial' }, flexDirection: { xs: 'row', sm: 'column' } }}>
				<Box sx={{ mb: { xs: 0, sm: 3 } }}>
					<Typography variant='overline' textTransform={'uppercase'}>
						{title}
					</Typography>

					{chartType === 'bar' && enableChart && <TrendingInfo percent={percent} />}

					<Typography variant='h3'>
						{current}
						{current !== undefined && '/'}
						{total}
					</Typography>
					{subtitle && <Typography variant='subtitle2'>{subtitle}</Typography>}
				</Box>
				{buttonLink && (
					<Box sx={{ mt: { xs: 'initial', sm: 'auto' }, ml: { xs: 'auto', sm: 'initial' } }}>
						<Button variant={'outlined'} color={'primary'} size={'small'} href={buttonLink}>
							{buttonText}
						</Button>
					</Box>
				)}
			</Box>
			{enableChart && (
				<>
					{chartType === 'bar' ? (
						<Chart type={'bar'} series={[{ data: series }]} options={chartOptions} width={60} height={36} />
					) : (
						<div style={{ width: '180px', height: '180px', margin: '0 auto' }}>
							<Chart type={chartType} series={[series]} options={chartOptions} width={180} height={180} />
						</div>
					)}
				</>
			)}
		</Card>
	);
}

// ----------------------------------------------------------------------
// All rights reserved - SEDZ PTY LTD - 2023
// ----------------------------------------------------------------------

TrendingInfo.propTypes = {
	percent: PropTypes.number,
};

function TrendingInfo({ percent }) {
	return (
		<Stack direction='row' alignItems='center' sx={{ mt: 2, mb: 1 }}>
			<Iconify
				icon={percent < 0 ? 'eva:trending-down-fill' : 'eva:trending-up-fill'}
				sx={{
					mr: 1,
					p: 0.5,
					width: 24,
					height: 24,
					borderRadius: '50%',
					color: 'success.main',
					bgcolor: (theme) => alpha(theme.palette.success.main, 0.16),
					...(percent < 0 && {
						color: 'error.main',
						bgcolor: (theme) => alpha(theme.palette.error.main, 0.16),
					}),
				}}
			/>

			<Typography component='div' variant='subtitle2'>
				{percent > 0 && '+'}

				{fPercent(percent)}
			</Typography>
		</Stack>
	);
}
