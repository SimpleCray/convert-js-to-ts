import { StyledCTASection, StyledInnerWrap } from './CTASectionStyles';
import { Typography } from '@mui/material';
import { forwardRef, useState } from 'react';
import { RegisterForm, VerifyForm, SelectZeliForm } from '../';
import { MotionViewport, varFade } from '../../../../components/animate';
import { m } from 'framer-motion';
import TermsDialog from 'src/components/termsModal';
import { Text32MidnightPurpleWeight400 } from '../../../../components/common/TypographyStyled';
import useResponsive from '../../../../hooks/useResponsive';

export const CTA_FLOW = {
	SIGN_UP: 'signup',
	VERIFY: 'verify',
	SELECT_ZELI: 'select-zeli',
	COMPLETE: 'complete',
};

export default function CTASection() {
	const isDesktop = useResponsive('up', 'md');
	const [form, setForm] = useState(CTA_FLOW.SIGN_UP);
	const [email, setEmail] = useState('');
	const [openTerms, setOpenTerms] = useState(false);

	const handleOpenTerms = () => {
		setOpenTerms(true);
	};

	const handleCloseTerms = () => {
		setOpenTerms(false);
	};

	return (
		<StyledCTASection id='contact' as={MotionViewport}>
			<StyledInnerWrap>
				<Typography fontSize={{ xs: '2rem', md: '3rem' }} align={'center'} sx={{ fontWeight: '300', color: '#21054C' }}>
					Become part of designing the future of work.
				</Typography>
				<m.div style={{ backgroundColor: 'white', color: '#21054C', width: '100%', maxWidth: '972px', margin: 'auto', borderRadius: '24px', padding: isDesktop ? '2rem' : '1rem' }} variants={varFade().inUp}>
					{form === CTA_FLOW.SIGN_UP && (
						<>
							<Typography fontSize={{ xs: '1rem', md: '2rem' }} variant={'body1'} align={'left'} gutterBottom>
								Explore the world of Zeligate.
							</Typography>
							<RegisterForm setForm={setForm} setEmail={setEmail} />
						</>
					)}
					{form === CTA_FLOW.VERIFY && <VerifyForm setForm={setForm} />}
					{form === CTA_FLOW.SELECT_ZELI && <SelectZeliForm setForm={setForm} email={email} />}
					{form === CTA_FLOW.COMPLETE && <Text32MidnightPurpleWeight400 sx={{ fontSize: { xs: 22, md: 32 }, textAlign: 'center' }}>Thank you for your interest</Text32MidnightPurpleWeight400>}
				</m.div>
			</StyledInnerWrap>
			<Typography sx={{ color: '#170058' }} textAlign={{ md: 'center' }} mt={{ xs: 4, md: 8 }}>
				When you opt in, you agree to receive marketing messages in accordance with our{' '}
				<span style={{ cursor: 'pointer', textDecoration: 'underline', color: '#9859E0' }} onClick={() => handleOpenTerms()}>
					terms and conditions
				</span>
			</Typography>
			{/* <StyledRibbon>
				<Ribbon ref={ref} />
			</StyledRibbon> */}
			<TermsDialog open={openTerms} handleClose={handleCloseTerms} />
		</StyledCTASection>
	);
}

const Ribbon = forwardRef((props, ref) => (
	<svg ref={ref} {...props} viewBox='0 0 2316 1157' fill='none' xmlns='http://www.w3.org/2000/svg'>
		<path
			d='M37.4844 661.729C146.024 516.889 280.624 391.449 431.564 291.729C583.154 191.579 751.134 116.879 927.524 73.0888C1012.67 51.9489 1099.81 37.3788 1187.83 40.5388C1270.52 43.4988 1355.4 63.3589 1422.18 114.439C1492.73 168.409 1533.92 253.709 1544.03 340.949C1555.51 439.929 1529.66 539.319 1486.08 627.789C1408 786.299 1278.34 916.139 1124.53 1001.9C1048.87 1044.09 967.504 1075.43 883.034 1094.7C800.724 1113.47 712.314 1122.91 628.164 1112.41C589.254 1107.55 549.804 1096.71 517.154 1074.38C484.504 1052.05 463.234 1015.58 459.944 975.939C452.744 889.219 505.934 807.999 565.894 750.329C685.024 635.749 859.134 592.559 1020.72 600.909C1222.86 611.349 1412.17 701.999 1586.84 797.389C1768.83 896.779 1946.26 1008.82 2144.64 1073.55C2192.37 1089.12 2241.03 1101.63 2290.46 1110.44C2301.08 1112.33 2312.01 1107.56 2315.06 1096.47C2317.72 1086.8 2311.78 1073.77 2301.09 1071.87C2087.76 1033.85 1897.25 925.979 1710.86 820.779C1524.92 715.829 1332.47 608.559 1119.35 572.209C946.574 542.749 757.294 565.809 609.194 664.759C535.374 714.079 470.834 782.819 438.164 866.309C420.894 910.429 413.524 960.099 424.674 1006.67C435.274 1050.95 463.984 1088.15 502.154 1112.36C576.584 1159.58 674.514 1160.04 759.414 1153.57C849.744 1146.69 938.914 1126.31 1023.31 1093.42C1193.44 1027.1 1343.9 913.319 1450.48 764.679C1565.92 603.689 1637.89 384.009 1541.23 196.699C1498.63 114.159 1424.74 55.2388 1337.31 25.8288C1252.01 -2.87113 1158.78 -4.55115 1070.13 5.81884C976.964 16.7188 885.014 39.9389 796.164 69.6788C705.964 99.8788 618.294 138.009 534.644 183.299C367.914 273.569 216.204 392.859 90.1344 534.539C59.5244 568.929 30.5444 604.719 2.9344 641.559C-3.5456 650.209 1.5344 663.909 10.1144 668.919C20.3344 674.899 30.9844 670.419 37.4744 661.739L37.4844 661.729Z'
			fill='url(#paint0_linear_134_3)'
		/>
		<defs>
			<linearGradient id='paint0_linear_134_3' x1='287.579' y1='430.797' x2='2567.04' y2='430.797' gradientUnits='userSpaceOnUse'>
				<stop stopColor='#21054C' />
				<stop offset='1' stopColor='#9F7CD1' />
			</linearGradient>
		</defs>
	</svg>
));
