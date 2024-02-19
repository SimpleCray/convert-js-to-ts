import propTypes from 'prop-types';
import { useEffect, useRef } from 'react';
import {isNil} from "lodash";

import { StyledAvatarSelector } from './AvatarSelectorStyles';

AvatarSelector.propTypes = {
    assistant: propTypes.object,
    onAvatarSelect: propTypes.func,
    selected: propTypes.bool,
    step: propTypes.number,
};

export default function AvatarSelector({ assistant, onAvatarSelect, selected, step, play, className = '', ...props }) {
    const videoRef = useRef(null);

    const handlePlayVideoOnHover = (e) => {
        e.currentTarget.querySelector('video').play();
        e.target?.classList.add('hovered');
    };

    const handlePauseVideoOnHover = (e) => {
        e.currentTarget.querySelector('video').pause();
        e.target?.classList.remove('hovered');
    };

    // If !!onAvatarSelect play another video and then at the end of the video loop the avatarVideo again
    useEffect(() => {
        if (!videoRef.current) {
            return;
        }

        if (!isNil(play)) {
            if (play) {
                videoRef.current.src = step === 2 ? assistant?.dialogueVideo2 : assistant?.dialogueVideo;
            } else {
                videoRef.current.src = assistant?.avatarVideo;
                videoRef.current.onended = () => {
                    videoRef.current.src = assistant?.avatarVideo;
                    videoRef.current.loop = true;
                    videoRef.current.muted = true;
                    videoRef.current?.play();
                };
            }
            videoRef.current.loop = !play;
            videoRef.current.muted = !play;
            videoRef.current.load();
            videoRef.current.play();
            return
        }

        if (!videoRef.current.src.includes('silence_60s.mp4')) {
            videoRef.current.load();
            videoRef.current.play();
            videoRef.current.loop = false;
            videoRef.current.muted = false;
            // on video end play silence video
            videoRef.current.onended = function () {
                videoRef.current.src = assistant?.avatarVideo;
                videoRef.current.loop = true;
                videoRef.current?.play();
            };
        }
    }, [videoRef, assistant?.id, onAvatarSelect, play]);

    let dialogueVideo = assistant?.dialogueVideo;
    if (step === 2) {
        dialogueVideo = assistant?.dialogueVideo2;
    }

    return (
        <StyledAvatarSelector
            className={`MuiAvatar-root${selected ? ' selected' : ''}${!!onAvatarSelect ? ' has-action' : ''}${className && ` ${className}`}`}
            onMouseEnter={onAvatarSelect ? handlePlayVideoOnHover : null}
            onMouseLeave={onAvatarSelect ? handlePauseVideoOnHover : null}
            onClick={onAvatarSelect ? () => onAvatarSelect(assistant?.id) : null}
            {...props}
        >
            <img src={assistant?.avatarImage} alt={assistant?.name} />
            <video ref={videoRef} src={!!onAvatarSelect ? assistant?.avatarVideo : dialogueVideo} autoPlay={!onAvatarSelect} loop={false} muted playsInline poster={assistant?.avatarImage} />
        </StyledAvatarSelector>
    );
}
