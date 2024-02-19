import numeral from 'numeral';
const locales = 'en-US';
const DEFAULT_CURRENCY = 'USD';
// ----------------------------------------------------------------------
// All rights reserved - SEDZ PTY LTD - 2023
// ----------------------------------------------------------------------

const defaultCurrencyFormatter = (currency = DEFAULT_CURRENCY) =>
	new Intl.NumberFormat(locales, {
		currency: currency || DEFAULT_CURRENCY,
		style: 'currency',
	});

export function formatCurrency(num, currency = DEFAULT_CURRENCY) {
	return defaultCurrencyFormatter(currency || DEFAULT_CURRENCY).format(num);
}

export function fNumber(number) {
	return numeral(number).format();
}

export function fCurrency(number, divide = false) {
	divide ? (number = (number / 100).toFixed(2)) : (number = number.toFixed(2));
	let format = number ? numeral(number).format('$0,0.00') : '';

	// set currency to have 2 decimal places
	return '$' + number;
}

export function fPercent(number) {
	const format = number ? numeral(Number(number) / 100).format('0.0%') : '';

	return result(format, '.0');
}

export function fShortenNumber(number) {
	const format = number ? numeral(number).format('0.00a') : '';

	return result(format, '.00');
}

export function fData(number) {
	const format = number ? numeral(number).format('0.0b') : '';

	return result(format, '.0');
}

function result(format, key = '.00') {
	const isInteger = format.includes(key);

	return isInteger ? format.replace(key, '') : format;
}
