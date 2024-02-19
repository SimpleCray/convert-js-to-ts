import { styled } from '@mui/material/styles';
import { GlobalStyles as MUIGlobalStyles } from '@mui/material';

export function StyledBackgroundStyles() {
	return (
		<MUIGlobalStyles
            styles={{
                body: {
                    backgroundImage: 'unset',
                },
            }}
		/>
	);
}
