import { useRef, useEffect } from "react";

import {
  VideoTimeDisplayContainer,
  RecordingIcon,
  RecordingTime,
} from "./VideoTimeDisplayStyles";
import FiberManualRecordRoundedIcon from "@mui/icons-material/FiberManualRecordRounded";

export const VideoTimeDisplay = ({ time }) => {
  return (
    <>
      <VideoTimeDisplayContainer>
        <RecordingTime variant="p2">{time}</RecordingTime>

        <RecordingIcon>
          <svg
            width="48"
            height="48"
            viewBox="0 0 48 48"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g clipPath="url(#clip0_4376_2152)">
              <rect
                x="0.5"
                width="48"
                height="48"
                rx="24"
                fill="white"
                fill-opacity="0.2"
              />
              <path
                d="M24.5 33C29.4706 33 33.5 28.9706 33.5 24C33.5 19.0294 29.4706 15 24.5 15C19.5294 15 15.5 19.0294 15.5 24C15.5 28.9706 19.5294 33 24.5 33Z"
                fill="#FF3C5D"
                stroke="white"
                strokeWidth="2"
              />
            </g>
            <defs>
              <clipPath id="clip0_4376_2152">
                <rect x="0.5" width="48" height="48" rx="24" fill="white" />
              </clipPath>
            </defs>
          </svg>
        </RecordingIcon>
      </VideoTimeDisplayContainer>
    </>
  );
};
