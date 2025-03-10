// stores/filters-store.ts
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface FiltersState {
	categoryId: string | null;
	vehicleId: string | null;
	dateFrom: Date | null;
	dateTo: Date | null;
	searchTerm: string | null;
	sortBy: "date" | "price" | "distance" | null;
	sortDirection: "asc" | "desc";
}

interface FiltersActions {
	setCategory: (id: string | null) => void;
	setVehicle: (id: string | null) => void;
	setDateRange: (from: Date | null, to: Date | null) => void;
	setSearchTerm: (term: string | null) => void;
	setSorting: (
		by: "date" | "price" | "distance" | null,
		direction?: "asc" | "desc",
	) => void;
	resetFilters: () => void;
}

type FiltersStore = FiltersState & FiltersActions;

// Initial state for the filters
const initialState: FiltersState = {
	categoryId: null,
	vehicleId: null,
	dateFrom: null,
	dateTo: null,
	searchTerm: null,
	sortBy: "date",
	sortDirection: "desc",
};

export const useFiltersStore = create<FiltersStore>()(
	persist(
		(set) => ({
			...initialState,

			setCategory: (id) => set({ categoryId: id }),

			setVehicle: (id) => set({ vehicleId: id }),

			setDateRange: (from, to) =>
				set({
					dateFrom: from,
					dateTo: to,
				}),

			setSearchTerm: (term) =>
				set({
					searchTerm: term,
				}),

			setSorting: (by, direction = "asc") =>
				set({
					sortBy: by,
					sortDirection: direction,
				}),

			resetFilters: () => set(initialState),
		}),
		{
			name: "transport-filters",
			// Only store the filter settings, not methods
			partialize: (state) => ({
				categoryId: state.categoryId,
				vehicleId: state.vehicleId,
				dateFrom: state.dateFrom,
				dateTo: state.dateTo,
				searchTerm: state.searchTerm,
				sortBy: state.sortBy,
				sortDirection: state.sortDirection,
			}),
		},
	),
);
