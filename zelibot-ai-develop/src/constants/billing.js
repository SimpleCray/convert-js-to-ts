import { BILLING_API, API_GET_PAYMENT_PLAN, API_INVOKE_PAYMENT, API_GET_INVOICE, API_PAYMENT_BASE } from '../config-global';
import axios from '../utils/axios';

export const getUserBalance = () => {
	return new Promise(async (resolve, reject) => {
		await axios
			.get(BILLING_API.USER_BALANCE)
			.then((response) => {
				resolve(response.data);
			})
			.catch((error) => {
				console.error('error: ', error);
				reject(error);
			});
	});
};

export const getPaymentUrl = (pkPricingModel, cancel_url, success_url) => {
	return new Promise(async (resolve, reject) => {
		await axios
			.post(BILLING_API.PAYMENT_AI, { pkPricingModel, cancel_url, success_url })
			.then((response) => {
				resolve(response.data);
			})
			.catch((error) => {
				console.error('error: ', error);
				reject(error);
			});
	});
};

export const getInvoiceHistory = (limit) => {
	const url = limit ? `${BILLING_API.INVOICE_AI}?limit=${limit}` : BILLING_API.INVOICE_AI;
	return new Promise(async (resolve, reject) => {
		await axios
			.get(url)
			.then((response) => {
				resolve(response.data);
			})
			.catch((error) => {
				console.error('error: ', error);
				reject(error);
			});
	});
};

export const getInvoice = (id) => {
	const url = id ? `${BILLING_API.INVOICE_AI}?id=${id}` : BILLING_API.INVOICE_AI;
	return new Promise(async (resolve, reject) => {
		await axios
			.get(url)
			.then((response) => {
				resolve(response.data);
			})
			.catch((error) => {
				console.error('error: ', error);
				reject(error);
			});
	});
};

export const getPricingPlans = (frequency) => {
	const url = BILLING_API.PRICING_AI + (frequency ? `?frequency=${frequency}` : '');
	return new Promise(async (resolve, reject) => {
		await axios
			.get(url)
			.then((response) => {
				resolve(response.data);
			})
			.catch((error) => {
				console.error('error: ', error);
				reject(error);
			});
	});
};

export const getUserBilling = () => {
	return new Promise(async (resolve, reject) => {
		await axios
			.get(BILLING_API.BILLING_AI)
			.then((response) => {
				resolve(response.data);
			})
			.catch((error) => {
				console.error('error: ', error);
				reject(error);
			});
	});
};

export const getCancelReasons = (category = 'DEFAULT') => {
	const url = BILLING_API.CANCEL_AI + (category ? `?category=${category}` : '');
	return new Promise(async (resolve, reject) => {
		await axios
			.get(url)
			.then((response) => {
				resolve(response.data);
			})
			.catch((error) => {
				console.error('error: ', error);
				reject(error);
			});
	});
};

export const cancelSubscription = (reason) => {
	return new Promise(async (resolve, reject) => {
		await axios
			.post(BILLING_API.CANCEL_AI, { CancelReason: reason })
			.then((response) => {
				resolve(response.data);
			})
			.catch((error) => {
				console.error('error: ', error);
				reject(error);
			});
	});
};

export const getPaymentPlan = (plan, pack) => {
	return new Promise(async (resolve, reject) => {
		await axios
			.get(`${API_PAYMENT_BASE}/payment_plan`, {
				params: {
					plan: plan,
					package: pack
				}
			})
			.then((response) => {
				resolve(response.data);
			})
			.catch((error) => {
				console.error('error: ', error);
				reject(error);
			});
	});
};

export const invokePayment = (body) => {
	return new Promise(async (resolve, reject) => {
		await axios
			.post(`${API_PAYMENT_BASE}/invoke_payment`, body)
			.then((response) => {
				resolve(response.data);
			})
			.catch((error) => {
				console.error('error: ', error);
				reject(error);
			});
	});
};

export const getInvoices = (params) => {
	return new Promise(async (resolve, reject) => {
		await axios
			.get(`${API_PAYMENT_BASE}/invoice_list`, { params: params })
			.then((response) => {
				resolve(response.data);
			})
			.catch((error) => {
				console.error('error: ', error);
				reject(error);
			});
	});
}

export const getCurrentSubscription = (params) => {
	return new Promise(async (resolve, reject) => {
		await axios
			.get(`${API_PAYMENT_BASE}/current_subscription`, { params: params })
			.then((response) => {
				resolve(response.data);
			})
			.catch((error) => {
				console.error('error: ', error);
				reject(error);
			});
	});
}

export const getCurrentCredits = (sk) => {
	return new Promise(async (resolve, reject) => {
		await axios
			.get(`${API_PAYMENT_BASE}/get_subscription/?sk=${sk}`)
			.then((response) => {
				resolve(response.data);
			})
			.catch((error) => {
				console.error('error: ', error);
				reject(error);
			});
	});
}

export const getPaymentInfo= () => {
	return new Promise(async (resolve, reject) => {
		await axios
			.get(`${API_PAYMENT_BASE}/payment_method`)
			.then((response) => {
				resolve(response.data);
			})
			.catch((error) => {
				console.error('error: ', error);
				reject(error);
			});
	});
}

export const getPurchaseHistory= () => {
	return new Promise(async (resolve, reject) => {
		await axios
			.get(`${API_PAYMENT_BASE}/purchase_history`)
			.then((response) => {
				resolve(response.data);
			})
			.catch((error) => {
				console.error('error: ', error);
				reject(error);
			});
	});
}

export const invoiceFrom = {
	name: 'Techzeli Technologies',
	address: 'Queensland, Australia',
	phone: '+61 2 8005 8005',
	email: 'billing@zelibot.ai',
};
