import { useLocalVideo, useAudioInputs, useAudioOutputs, useVideoInputs } from 'amazon-chime-sdk-component-library-react';
import { Button, Checkbox, DialogActions, DialogContent, DialogContentText, DialogTitle, FormControlLabel, Dialog } from '@mui/material';
export default function DeviceSelectionModal({ onClose, open }) {
	const { toggleVideo } = useLocalVideo();
	const { devices: audioInputs, selectedDevice: audioInputSelectedDevice } = useAudioInputs();
	const { devices: audioOutputs, selectedDevice: audioOutputSelectedDevice } = useAudioOutputs();
	const { devices: videoInputs, selectedDevice: videoInputSelectedDevice } = useVideoInputs();

	return (
		<Dialog onClose={onClose} open={open}>
			<DialogTitle>Device Selection</DialogTitle>
			<DialogContent>
				<DialogContentText>Select the devices you want to use for this meeting.</DialogContentText>
				<DialogContentText>{audioInputs.length > 0 && 'Audio inputs'}</DialogContentText>
				{audioInputs.map((device) => (
					<FormControlLabel control={<Checkbox checked={audioInputSelectedDevice === device} onChange={() => selectDevice(device)} value={device} />} label={device.label} />
				))}
				<DialogContentText>{audioOutputs.length > 0 && 'Audio outputs'}</DialogContentText>
				{audioOutputs.map((device) => (
					<FormControlLabel control={<Checkbox checked={audioOutputSelectedDevice === device} onChange={() => selectDevice(device)} value={device} />} label={device.label} />
				))}
				<DialogContentText>{videoInputs.length > 0 && 'Video inputs'}</DialogContentText>
				{videoInputs.map((device) => (
					<FormControlLabel control={<Checkbox checked={videoInputSelectedDevice === device} onChange={() => selectDevice(device)} value={device} />} label={device.label} />
				))}
			</DialogContent>
			<DialogActions>
				<Button onClick={onClose}>Cancel</Button>
				<Button onClick={onClose}>Save</Button>
			</DialogActions>
		</Dialog>
	);
}
