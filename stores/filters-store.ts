// stores/filters-store.ts
import { create } from "zustand";

type FiltersStore = {
	categoryId: string | null;
	vehicleId: string | null;
	dateFrom: Date | null;
	dateTo: Date | null;
	setCategory: (id: string | null) => void;
	setVehicle: (id: string | null) => void;
	setDateRange: (from: Date | null, to: Date | null) => void;
	resetFilters: () => void;
};

export const useFiltersStore = create<FiltersStore>((set) => ({
	categoryId: null,
	vehicleId: null,
	dateFrom: null,
	dateTo: null,

	setCategory: (id) => set({ categoryId: id }),
	setVehicle: (id) => set({ vehicleId: id }),
	setDateRange: (from, to) => set({ dateFrom: from, dateTo: to }),
	resetFilters: () =>
		set({
			categoryId: null,
			vehicleId: null,
			dateFrom: null,
			dateTo: null,
		}),
}));
