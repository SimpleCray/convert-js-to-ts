import { styled } from '@mui/material/styles';
import Button from '@mui/material/Button';


export const GreyButton = styled(Button)(({ theme }) => ({
  background: 'rgba(255, 255, 255, 0.20)',
  color: 'white'
}));

export const ZeligateButton = ({ time }) => {

  return (
    <>
        <GreyButton>
            End Interview
        </GreyButton>
    </>
  )


}