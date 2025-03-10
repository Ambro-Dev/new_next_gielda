// types/transport.ts
export interface Transport {
	id: string;
	category: {
		id: string;
		name: string;
	};
	vehicle: {
		id: string;
		name: string;
	};
	creator: {
		id: string;
		username: string;
		name?: string;
		surname?: string;
		student?: {
			name?: string;
			surname?: string;
		};
	};
	description: string;
	is_available: boolean;
	is_accepted: boolean;
	directions: {
		start: {
			lat: number;
			lng: number;
		};
		finish: {
			lat: number;
			lng: number;
		};
	};
	objects: TransportObject[];
	send_date: string;
	receive_date: string;
	send_time?: string;
	receive_time?: string;
	distance?: {
		text: string;
		value: number;
	};
	duration?: {
		text: string;
		value: number;
	};
	start_address?: string;
	end_address?: string;
	polyline?: string;
	created_at?: string;
	updated_at?: string;
	school_id?: string;
}

export interface TransportObject {
	id: string;
	name: string;
	description?: string;
	amount: number;
	width: number;
	height: number;
	length: number;
	weight: number;
	transport_id?: string;
}

export interface TransportOffer {
	id: string;
	currency: "PLN" | "EUR" | "USD";
	vat: number;
	netto: number;
	brutto: number;
	load_date: string;
	unload_date: string;
	unload_time: number;
	contact_number: string;
	is_accepted: boolean;
	transport_id: string;
	creator: {
		id: string;
		username: string;
		email?: string;
	};
	created_at?: string;
	updated_at?: string;
}

export interface TransportMessage {
	id: string;
	text: string;
	is_read: boolean;
	created_at: string;
	conversation_id?: string;
	sender: {
		id: string;
		username: string;
	};
	receiver?: {
		id: string;
		username: string;
	};
}

export interface OfferFile {
	id: string;
	file_name: string;
	name: string;
	file_size: number;
	size: number;
	file_key: string;
	key: string;
	file_url: string;
	url: string;
	offer_id: string;
	user_id: string;
	created_at?: string;
}

export interface Tag {
	id: string;
	name: string;
	_count?: {
		transports: number;
	};
}

export interface TransportDirection {
	start: {
		lat: number;
		lng: number;
	};
	finish: {
		lat: number;
		lng: number;
	};
}

export type TransportFormData = {
	category: string;
	vehicle: string;
	description: string;
	send_date: Date;
	send_time: string;
	receive_date: Date;
	receive_time: string;
	objects: Omit<TransportObject, "id" | "transport_id">[];
	directions: TransportDirection;
};

export type TransportFilterParams = {
	categoryId?: string;
	vehicleId?: string;
	dateFrom?: string;
	dateTo?: string;
	searchTerm?: string;
	sortBy?: "date" | "price" | "distance";
	sortDirection?: "asc" | "desc";
};
