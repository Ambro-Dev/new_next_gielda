// types/database.types.ts
export type Json =
	| string
	| number
	| boolean
	| null
	| { [key: string]: Json | undefined }
	| Json[];

export interface Database {
	public: {
		Tables: {
			users: {
				Row: {
					id: string;
					username: string;
					email: string;
					email_verified: string | null;
					name: string | null;
					surname: string | null;
					phone: string | null;
					image: string | null;
					bio: string | null;
					is_blocked: boolean;
					role: "user" | "admin" | "school_admin" | "student";
					admin_of_school_id: string | null;
					created_at: string;
					updated_at: string;
				};
				Insert: {
					id: string;
					username: string;
					email: string;
					email_verified?: string | null;
					name?: string | null;
					surname?: string | null;
					phone?: string | null;
					image?: string | null;
					bio?: string | null;
					is_blocked?: boolean;
					role?: "user" | "admin" | "school_admin" | "student";
					admin_of_school_id?: string | null;
					created_at?: string;
					updated_at?: string;
				};
				Update: {
					id?: string;
					username?: string;
					email?: string;
					email_verified?: string | null;
					name?: string | null;
					surname?: string | null;
					phone?: string | null;
					image?: string | null;
					bio?: string | null;
					is_blocked?: boolean;
					role?: "user" | "admin" | "school_admin" | "student";
					admin_of_school_id?: string | null;
					created_at?: string;
					updated_at?: string;
				};
			};
			schools: {
				Row: {
					id: string;
					name: string;
					is_active: boolean;
					access_expires: string;
					identifier: string;
					created_at: string;
					updated_at: string;
				};
				Insert: {
					id?: string;
					name: string;
					is_active?: boolean;
					access_expires: string;
					identifier: string;
					created_at?: string;
					updated_at?: string;
				};
				Update: {
					id?: string;
					name?: string;
					is_active?: boolean;
					access_expires?: string;
					identifier?: string;
					created_at?: string;
					updated_at?: string;
				};
			};
			students: {
				Row: {
					id: string;
					name: string | null;
					surname: string | null;
					phone: string | null;
					bio: string | null;
					school_id: string;
					user_id: string;
					created_at: string;
					updated_at: string;
				};
				Insert: {
					id?: string;
					name?: string | null;
					surname?: string | null;
					phone?: string | null;
					bio?: string | null;
					school_id: string;
					user_id: string;
					created_at?: string;
					updated_at?: string;
				};
				Update: {
					id?: string;
					name?: string | null;
					surname?: string | null;
					phone?: string | null;
					bio?: string | null;
					school_id?: string;
					user_id?: string;
					created_at?: string;
					updated_at?: string;
				};
			};
			categories: {
				Row: {
					id: string;
					name: string;
					created_at: string;
					updated_at: string;
				};
				Insert: {
					id?: string;
					name: string;
					created_at?: string;
					updated_at?: string;
				};
				Update: {
					id?: string;
					name?: string;
					created_at?: string;
					updated_at?: string;
				};
			};
			vehicles: {
				Row: {
					id: string;
					name: string;
					created_at: string;
					updated_at: string;
				};
				Insert: {
					id?: string;
					name: string;
					created_at?: string;
					updated_at?: string;
				};
				Update: {
					id?: string;
					name?: string;
					created_at?: string;
					updated_at?: string;
				};
			};
			users_vehicles: {
				Row: {
					id: string;
					user_id: string;
					type:
						| "large_box"
						| "large_low"
						| "large_tanker"
						| "large_flat"
						| "medium_box"
						| "medium_low"
						| "medium_tanker"
						| "medium_flat"
						| "small_box"
						| "small_low"
						| "small_flat"
						| "bus"
						| "car_trailer_box"
						| "car_trailer_low";
					name: string;
					place: Json;
					size: Json;
					description: string;
					created_at: string;
					updated_at: string;
				};
				Insert: {
					id?: string;
					user_id: string;
					type:
						| "large_box"
						| "large_low"
						| "large_tanker"
						| "large_flat"
						| "medium_box"
						| "medium_low"
						| "medium_tanker"
						| "medium_flat"
						| "small_box"
						| "small_low"
						| "small_flat"
						| "bus"
						| "car_trailer_box"
						| "car_trailer_low";
					name: string;
					place: Json;
					size: Json;
					description: string;
					created_at?: string;
					updated_at?: string;
				};
				Update: {
					id?: string;
					user_id?: string;
					type?:
						| "large_box"
						| "large_low"
						| "large_tanker"
						| "large_flat"
						| "medium_box"
						| "medium_low"
						| "medium_tanker"
						| "medium_flat"
						| "small_box"
						| "small_low"
						| "small_flat"
						| "bus"
						| "car_trailer_box"
						| "car_trailer_low";
					name?: string;
					place?: Json;
					size?: Json;
					description?: string;
					created_at?: string;
					updated_at?: string;
				};
			};
			directions: {
				Row: {
					id: string;
					start: Json;
					finish: Json;
					transport_id: string | null;
					created_at: string;
					updated_at: string;
				};
				Insert: {
					id?: string;
					start: Json;
					finish: Json;
					transport_id?: string | null;
					created_at?: string;
					updated_at?: string;
				};
				Update: {
					id?: string;
					start?: Json;
					finish?: Json;
					transport_id?: string | null;
					created_at?: string;
					updated_at?: string;
				};
			};
			transports: {
				Row: {
					id: string;
					category_id: string;
					vehicle_id: string;
					is_available: boolean;
					is_accepted: boolean;
					send_date: string;
					send_time: string;
					receive_date: string;
					receive_time: string;
					distance: Json | null;
					duration: Json | null;
					end_address: string | null;
					start_address: string | null;
					polyline: string | null;
					description: string;
					creator_id: string;
					school_id: string | null;
					directions_id: string | null;
					created_at: string;
					updated_at: string;
				};
				Insert: {
					id?: string;
					category_id: string;
					vehicle_id: string;
					is_available: boolean;
					is_accepted?: boolean;
					send_date: string;
					send_time: string;
					receive_date: string;
					receive_time: string;
					distance?: Json | null;
					duration?: Json | null;
					end_address?: string | null;
					start_address?: string | null;
					polyline?: string | null;
					description: string;
					creator_id: string;
					school_id?: string | null;
					directions_id?: string | null;
					created_at?: string;
					updated_at?: string;
				};
				Update: {
					id?: string;
					category_id?: string;
					vehicle_id?: string;
					is_available?: boolean;
					is_accepted?: boolean;
					send_date?: string;
					send_time?: string;
					receive_date?: string;
					receive_time?: string;
					distance?: Json | null;
					duration?: Json | null;
					end_address?: string | null;
					start_address?: string | null;
					polyline?: string | null;
					description?: string;
					creator_id?: string;
					school_id?: string | null;
					directions_id?: string | null;
					created_at?: string;
					updated_at?: string;
				};
			};
			objects: {
				Row: {
					id: string;
					name: string;
					description: string | null;
					amount: number;
					width: number;
					height: number;
					length: number;
					weight: number;
					transport_id: string;
					created_at: string;
					updated_at: string;
				};
				Insert: {
					id?: string;
					name: string;
					description?: string | null;
					amount: number;
					width: number;
					height: number;
					length: number;
					weight: number;
					transport_id: string;
					created_at?: string;
					updated_at?: string;
				};
				Update: {
					id?: string;
					name?: string;
					description?: string | null;
					amount?: number;
					width?: number;
					height?: number;
					length?: number;
					weight?: number;
					transport_id?: string;
					created_at?: string;
					updated_at?: string;
				};
			};
			conversations: {
				Row: {
					id: string;
					transport_id: string | null;
					created_at: string;
					updated_at: string;
				};
				Insert: {
					id?: string;
					transport_id?: string | null;
					created_at?: string;
					updated_at?: string;
				};
				Update: {
					id?: string;
					transport_id?: string | null;
					created_at?: string;
					updated_at?: string;
				};
			};
			conversation_participants: {
				Row: {
					conversation_id: string;
					user_id: string;
				};
				Insert: {
					conversation_id: string;
					user_id: string;
				};
				Update: {
					conversation_id?: string;
					user_id?: string;
				};
			};
			messages: {
				Row: {
					id: string;
					text: string;
					is_read: boolean;
					conversation_id: string;
					sender_id: string;
					receiver_id: string;
					created_at: string;
					updated_at: string;
				};
				Insert: {
					id?: string;
					text: string;
					is_read?: boolean;
					conversation_id: string;
					sender_id: string;
					receiver_id: string;
					created_at?: string;
					updated_at?: string;
				};
				Update: {
					id?: string;
					text?: string;
					is_read?: boolean;
					conversation_id?: string;
					sender_id?: string;
					receiver_id?: string;
					created_at?: string;
					updated_at?: string;
				};
			};
			offers: {
				Row: {
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
					creator_id: string;
					created_at: string;
					updated_at: string;
				};
				Insert: {
					id?: string;
					currency: "PLN" | "EUR" | "USD";
					vat: number;
					netto: number;
					brutto: number;
					load_date: string;
					unload_date: string;
					unload_time: number;
					contact_number: string;
					is_accepted?: boolean;
					transport_id: string;
					creator_id: string;
					created_at?: string;
					updated_at?: string;
				};
				Update: {
					id?: string;
					currency?: "PLN" | "EUR" | "USD";
					vat?: number;
					netto?: number;
					brutto?: number;
					load_date?: string;
					unload_date?: string;
					unload_time?: number;
					contact_number?: string;
					is_accepted?: boolean;
					transport_id?: string;
					creator_id?: string;
					created_at?: string;
					updated_at?: string;
				};
			};
			offer_messages: {
				Row: {
					id: string;
					text: string;
					is_read: boolean;
					offer_id: string;
					sender_id: string;
					receiver_id: string;
					created_at: string;
					updated_at: string;
				};
				Insert: {
					id?: string;
					text: string;
					is_read?: boolean;
					offer_id: string;
					sender_id: string;
					receiver_id: string;
					created_at?: string;
					updated_at?: string;
				};
				Update: {
					id?: string;
					text?: string;
					is_read?: boolean;
					offer_id?: string;
					sender_id?: string;
					receiver_id?: string;
					created_at?: string;
					updated_at?: string;
				};
			};
			files: {
				Row: {
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
					created_at: string;
				};
				Insert: {
					id?: string;
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
				};
				Update: {
					id?: string;
					file_name?: string;
					name?: string;
					file_size?: number;
					size?: number;
					file_key?: string;
					key?: string;
					file_url?: string;
					url?: string;
					offer_id?: string;
					user_id?: string;
					created_at?: string;
				};
			};
			reports: {
				Row: {
					id: string;
					place: string;
					content: string;
					seen: boolean;
					file_url: string | null;
					user_id: string;
					created_at: string;
					updated_at: string;
				};
				Insert: {
					id?: string;
					place: string;
					content: string;
					seen?: boolean;
					file_url?: string | null;
					user_id: string;
					created_at?: string;
					updated_at?: string;
				};
				Update: {
					id?: string;
					place?: string;
					content?: string;
					seen?: boolean;
					file_url?: string | null;
					user_id?: string;
					created_at?: string;
					updated_at?: string;
				};
			};
			reset_tokens: {
				Row: {
					id: string;
					token: string;
					expires: string;
					user_id: string;
					created_at: string;
				};
				Insert: {
					id?: string;
					token: string;
					expires: string;
					user_id: string;
					created_at?: string;
				};
				Update: {
					id?: string;
					token?: string;
					expires?: string;
					user_id?: string;
					created_at?: string;
				};
			};
		};
		Views: {
			[_ in never]: never;
		};
		Functions: {
			[_ in never]: never;
		};
		Enums: {
			user_role: "user" | "admin" | "school_admin" | "student";
			currency_type: "PLN" | "EUR" | "USD";
			vehicle_type:
				| "large_box"
				| "large_low"
				| "large_tanker"
				| "large_flat"
				| "medium_box"
				| "medium_low"
				| "medium_tanker"
				| "medium_flat"
				| "small_box"
				| "small_low"
				| "small_flat"
				| "bus"
				| "car_trailer_box"
				| "car_trailer_low";
		};
	};
}
