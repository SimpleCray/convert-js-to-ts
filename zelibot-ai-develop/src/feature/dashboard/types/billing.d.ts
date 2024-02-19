export type Credit = {
	credit_limit: string;
	credit_usage: string;
	pk: string;
	sk: string;
};

export type Subscription = {
	button_text: string;
	credits: number;
	currency: string;
	current_price: number;
	gateway_key: string;
	gateway_mode: string;
	package_banner: string;
	package_subtitle: string;
	package_title: string;
	payment_frequency: string;
	payment_frequency_active_text: string;
	payment_frequency_inactive_text: string;
	pk: string;
	price_footer: string;
};

export type Card = {
	last4: string;
	brand: string;
};

export type Billing = {
	phone: string;
	name: string;
	email: string;
	address: {
		city: string;
		country: 'AU';
		line1: null;
		line2: null;
		postal_code: null;
		state: null;
	};
};

export type PurchaseHistory = {
	purchase_history_id: number;
	credit_balance: number;
	gateway_mode: string;
	gateway_id: string;
	subscription_id: string;
	purchase_utc_date: string;
	plan: string;
	package: string;
	description: string;
};
