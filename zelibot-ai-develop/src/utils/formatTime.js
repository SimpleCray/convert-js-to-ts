import { format, getTime, formatDistanceToNow } from 'date-fns';

// ----------------------------------------------------------------------
// All rights reserved - SEDZ PTY LTD - 2023
// ----------------------------------------------------------------------

export function fDate(date, newFormat) {
	const fm = newFormat || 'dd MMM yyyy';

	return date ? format(new Date(date), fm) : '';
}

export function fDateTime(date, newFormat) {
	const fm = newFormat || 'dd MMM yyyy p';

	return date ? format(new Date(date), fm) : '';
}

export function fTimestamp(date) {
	return date ? getTime(new Date(date)) : '';
}

// utc-datetime is a string in the format of "1677750618"
export function fUtcDateTime(date) {
	return date ? format(new Date(date * 1000), 'dd MMM yyyy p') : '';
}

export function fToNow(date) {
	try {
		return date
			? formatDistanceToNow(new Date(date), {
					addSuffix: true,
				})
			: '';
	} catch (e) {
		console.error(e);
		return '';
	}
}

export function convertUTCToLocalDate(date) {
		const newUtcDate = new Date(date + 'UTC');
		return newUtcDate;
}

export function convertTimestampToLocalDateString(timestamp) {
    // Create a new Date object from the given UNIX timestamp (multiplied by 1000 to convert seconds to milliseconds)
    const date = new Date(timestamp * 1000);

    // Extract the year, month, and day from the Date object based on local time
    const year = date.getFullYear();
    // getMonth() returns a 0-indexed month, so add 1 to get the correct month number
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Pad with leading zero if necessary
    const day = date.getDate().toString().padStart(2, '0'); // Pad with leading zero if necessary

    // Format the date as 'YYYY/MM/DD'
    return `${year}/${month}/${day}`;
}
