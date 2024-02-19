import { GlobalStyles as MUIGlobalStyles } from '@mui/material';

export function StyledBackgroundStyles({ bgGradient = 1 }) {
	return (
		<MUIGlobalStyles
			styles={{
				body: {
					backgroundImage: `url(/assets/images/hero-gradient-bg-${bgGradient}.jpg)`,
					backgroundRepeat: 'no-repeat',
					backgroundSize: '140vw 100vh',
					backgroundAttachment: 'fixed',
					backgroundPosition: '-20vw 0px',
					'&::before': {
						content: '""',
						position: 'fixed',
						top: 0,
						left: 0,
						height: '100%',
						width: '100%',
						zIndex: -1,
						backgroundImage: `url(/assets/images/hero-gradient-bg-${bgGradient}.jpg)`,
						backgroundRepeat: 'no-repeat',
						backgroundPosition: 'center center',
						backgroundSize: 'cover',
						willChange: 'transform',
					},
				},
			}}
		/>
	);
}
