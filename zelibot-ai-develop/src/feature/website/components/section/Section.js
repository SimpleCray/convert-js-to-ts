import { StyledSection, StyledRibbon, StyledImageWrapper, StyledImageContent, StyledImage, StyledContent, StyledSectionAlt } from './SectionStyles';
import { forwardRef } from 'react';
import { m } from 'framer-motion';
import { varFade, MotionViewport } from '../../../../components/animate';
import { Grid, Stack, Typography } from '@mui/material';
import useResponsive from 'src/hooks/useResponsive';

export default function Section({ type = 'fullwidth', image, enableRibbon = false, scaleToViewport = true, background, topContent = '', sectionContentStyle, textColor, sx, children }) {
	switch (type) {
		case 'image-left-alt':
			return (
				<StyledSectionAlt as={MotionViewport} scaleToViewport={scaleToViewport} background={background}>
					<Stack sx={{ height: 1 }} direction={{ xs: 'column', md: 'row' }}>
						<StyledImageWrapper as={m.div} variants={varFade().inLeft}>
							{/* <StyledImage className={'alt'}> */}
								<m.img src={image} alt='hero' />
							{/* </StyledImage> */}
						</StyledImageWrapper>
						<StyledContent className={sectionContentStyle ? sectionContentStyle : 'column alt'} as={m.div} variants={varFade({ durationIn: 1 }).inRight}>
							{children}
						</StyledContent>
					</Stack>
					<StyledRibbon>{enableRibbon && <Ribbon />}</StyledRibbon>
				</StyledSectionAlt>
			);
		case 'image-right-alt':
			return (
				<StyledSectionAlt as={MotionViewport} scaleToViewport={scaleToViewport} background={background} imageSide='right'>
					<Stack sx={{ height: 1 }} direction={{ xs: 'column', md: 'row-reverse' }}>
						<StyledImageWrapper className={'column'} as={m.div} variants={varFade().inRight}>
							<StyledImage className={'alt'} direction={'right'}>
								<m.img src={image} alt='hero' />
							</StyledImage>
						</StyledImageWrapper>
						<StyledContent className={sectionContentStyle ? sectionContentStyle : 'column alt'} as={m.div} variants={varFade({ durationIn: 1 }).inRight}>
							{children}
						</StyledContent>
					</Stack>
					<StyledRibbon>{enableRibbon && <Ribbon />}</StyledRibbon>
				</StyledSectionAlt>
			);
		case 'image-left':
			return (
				<StyledSection as={MotionViewport} scaleToViewport={scaleToViewport}>
					<Grid container sx={{ height: 1 }}>
						<Grid item xs={12} md={6} component={m.div} variants={varFade().inLeft}>
							<StyledImageWrapper className={'column'}>
								<StyledImage>
									<m.img src={image} alt='hero' />
								</StyledImage>
							</StyledImageWrapper>
						</Grid>
						<Grid item xs={12} md={6} component={m.div} variants={varFade({ durationIn: 1 }).inRight}>
							<StyledContent className={'column'}>{children}</StyledContent>
						</Grid>
					</Grid>
					<StyledRibbon>{enableRibbon && <Ribbon />}</StyledRibbon>
				</StyledSection>
			);
		case 'middle-image':
			return (
				<StyledSectionAlt as={MotionViewport} scaleToViewport={scaleToViewport} background={background} paddingType={'vertical'}>
					<Stack sx={{ height: 1 }} direction={{ xs: 'column', md: 'row' }}>
						<Typography variant='p' paddingX={2} sx={{ color: textColor ? textColor : 'rgba(33, 5, 76, 1)', fontWeight: '300',
								letterSpacing: 0,
								marginBottom: 4, fontSize: 22 }}>
							{topContent}
						</Typography>
						<StyledImageWrapper className={'column'} as={m.div} variants={varFade().inLeft}>
							<StyledImage className={''} stretch={true}>
								<m.img src={image} alt='hero' />
							</StyledImage>
						</StyledImageWrapper>
						<StyledContent className={sectionContentStyle ? sectionContentStyle : 'column alt'} as={m.div} variants={varFade({ durationIn: 1 }).inRight}>
							{children}
						</StyledContent>
					</Stack>
					<StyledRibbon>{enableRibbon && <Ribbon />}</StyledRibbon>
				</StyledSectionAlt>
			)
		default:
			return (
				<StyledSection as={MotionViewport} scaleToViewport={scaleToViewport} sx={sx}>
					{image ? (
						<StyledImageWrapper as={m.div} variants={varFade().inUp}>
							<StyledImage>
								<m.img src={image} alt='hero' />
							</StyledImage>
							<StyledImageContent as={m.div} variants={varFade({ durationIn: 1 }).inUp}>
								{children}
							</StyledImageContent>
						</StyledImageWrapper>
					) : (
						<StyledContent as={m.div} variants={varFade().inUp}>
							{children}
						</StyledContent>
					)}
					<StyledRibbon>{enableRibbon && <Ribbon />}</StyledRibbon>
				</StyledSection>
			);
	}
}

const Ribbon = forwardRef((props, ref) => (
	<svg ref={ref} {...props} xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1920 1002' fill='none'>
		<m.path
			d='M-90.9025 591.072C43.0375 462.992 194.418 353.977 357.928 266.758C521.338 179.588 696.407 114.593 877.177 74.2529C922.338 64.1752 967.838 55.6372 1013.59 48.6789C1061.47 41.4006 1111.33 32.7426 1159.87 36.4617C1201.19 39.631 1246.87 58.3866 1264.26 98.9671C1280.9 137.798 1257.11 174.599 1229.27 200.533C1195.88 231.626 1154.73 254.091 1116.99 279.345C1074.39 307.848 1032.4 337.261 991.048 367.554C908.558 428 828.547 491.845 751.417 558.989C713.407 592.072 676.098 625.954 639.518 660.596C604.978 693.308 568.607 727.15 547.297 770.45C528.707 808.201 522.097 853.84 538.427 893.621C554.417 932.572 590.918 957.376 631.848 964.094C678.968 971.833 723.888 958.236 766.788 939.52C814.538 918.695 861.228 895.441 908.908 874.405C1005.54 831.785 1103.76 792.775 1203.23 757.293C1302.45 721.911 1402.93 690.069 1504.43 661.875C1555.08 647.799 1606.52 631.812 1658.36 622.774C1682.52 618.565 1709.14 617.706 1730.53 631.442C1746.15 641.47 1757.34 658.396 1752.58 677.352C1747.94 695.857 1730.5 709.904 1715.65 720.442C1694.32 735.598 1671.75 749.165 1649.77 763.351C1603.24 793.384 1556.71 823.427 1510.18 853.46C1473.99 876.825 1436.39 900.939 1411.75 937.231C1389.28 970.323 1384.67 1014.4 1408.29 1048.3C1470.61 1137.74 1589.54 1091.65 1672.11 1065C1776.02 1031.46 1879.68 997.157 1983.09 962.115C2191.68 891.421 2399.23 817.679 2605.66 740.917C2656.39 722.051 2707.06 702.996 2757.65 683.77C2778.5 675.852 2769.46 642.01 2748.35 650.028C2541.59 728.58 2333.71 804.142 2124.74 876.615C2020.7 912.697 1916.39 948.018 1811.84 982.58C1759.56 999.856 1707.22 1016.94 1654.82 1033.84C1606.15 1049.53 1551.07 1073.91 1498.86 1065.26C1462 1059.15 1422.48 1030.66 1427.62 989.109C1432.57 949.088 1473.49 919.505 1504.35 898.93C1549.6 868.767 1595.74 839.864 1641.43 810.37C1664.3 795.604 1687.17 780.847 1710.04 766.081C1728.42 754.224 1747.46 742.266 1762.62 726.29C1792.12 695.197 1798.1 651.848 1768.72 618.375C1735.74 580.814 1683.26 581.604 1638.27 591.162C1534.54 613.187 1431.84 644.899 1330.93 677.212C1230.61 709.334 1131.43 745.036 1033.66 784.247C985.028 803.752 936.728 824.097 888.807 845.272C841.107 866.347 794.458 890.012 746.497 910.437C705.557 927.873 658.607 940.68 615.367 923.484C574.378 907.188 558.258 864.738 566.008 823.128C574.698 776.488 607.857 740.087 640.667 707.974C677.008 672.413 714.628 638.071 752.688 604.359C829.607 536.225 909.417 471.35 991.958 410.134C1033.13 379.601 1074.95 349.948 1117.39 321.195C1156.34 294.811 1197.46 270.957 1234.49 241.874C1265.92 217.179 1296.63 184.727 1303.24 143.737C1309.9 102.476 1291.4 63.2754 1259.29 37.5515C1222.21 7.87842 1175.16 -0.549609 1128.67 0.880056C1080.9 2.34971 1032.8 10.2379 985.678 17.8461C802.128 47.5091 623.138 102.846 454.117 180.178C285.818 257.18 128.038 356.697 -13.9925 475.339C-48.9125 504.502 -82.7825 534.885 -115.662 566.328C-131.972 581.924 -107.202 606.648 -90.9125 591.072H-90.9025Z'
			fill='#3B0099'
			fillOpacity='0.5'
		/>
	</svg>
));
