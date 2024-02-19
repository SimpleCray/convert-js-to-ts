import { useCallback, useRef, useState } from 'react';

export default function useControlled({ controlled, name, default: defaultProp }) {
	// isControlled is ignored in the hook dependency lists as it should never change.
	const { current: isControlled } = useRef(controlled !== undefined);
	const [valueState, setValue] = useState(defaultProp);
	const value = isControlled ? controlled : valueState;

	const setValueIfUncontrolled = useCallback((newValue) => {
		if (!isControlled) {
			setValue(newValue);
		}
	}, []);

	return [value, setValueIfUncontrolled];
}
