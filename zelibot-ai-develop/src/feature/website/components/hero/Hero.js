import { StyledHero, StyledTypographyHeading, StyledImageBackground, DownArrow } from './HeroStyles';
import { m } from 'framer-motion';
import { varFade, MotionViewport } from '../../../../components/animate';
import downArrow from '/assets/icons/home/down-arrow.svg';
import useResponsive from 'src/hooks/useResponsive';

export default function Hero({ title, textStyle, image }) {
	const isDesktop = useResponsive('up', 'md');

	return (
		<StyledHero as={MotionViewport} className={image ? 'hasImage' : undefined}>
			<m.div variants={varFade().in}>
				<StyledTypographyHeading variant='h1' component='h1' align='center' textStyle={textStyle}>
					<div className={'text'} dangerouslySetInnerHTML={{ __html: title }} />
					{/* <div className='bgShadow' dangerouslySetInnerHTML={{ __html: title }} /> */}
				</StyledTypographyHeading>
			</m.div>
			{image && (
				<StyledImageBackground>
					<img src={image} alt={title + ' image'} />
				</StyledImageBackground>
			)}
			{/* {isDesktop ? ( */}
			<DownArrow onClick={() => window.scrollTo({ top: window.innerHeight, behavior: 'smooth' })}>
				<img src={downArrow} style={{ cursor: 'pointer' }}></img>
			</DownArrow>
			{/* ) : null} */}
		</StyledHero>
	);
}
