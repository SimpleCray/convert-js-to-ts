import {m} from "framer-motion"
import VolumeUpRoundedIcon from "@mui/icons-material/VolumeUpRounded";
import VolumeDownRoundedIcon from '@mui/icons-material/VolumeDownRounded';

const DEFAULT_TRANSITION_TIME = 2;

export default (props) => (
    <span style={{position: "relative"}} {...props}>
        <m.span
            style={{position: "absolute", left: -2}}
            initial={{opacity: 1}}
            animate={{opacity: 0}}
            transition={{
                duration: DEFAULT_TRANSITION_TIME,
                ease: 'easeIn',
                repeat: Infinity,
            }}
        >
            <VolumeDownRoundedIcon/>
        </m.span>
        <m.span
            style={{position: "absolute"}}
            initial={{opacity: 0}}
            animate={{opacity: 1}}
            transition={{
                duration: DEFAULT_TRANSITION_TIME,
                ease: 'easeOut',
                repeat: Infinity,
            }}
        >
            <VolumeUpRoundedIcon />
        </m.span>
    </span>
);
