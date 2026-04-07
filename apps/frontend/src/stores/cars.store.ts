import { defineStore } from 'pinia';
import { carsApi } from '@/api/cars.api';
import type { Car, CarFilterParams } from '@fh6/types';

interface CarsState {
  cars: Car[];
  currentCar: Car | null;
  total: number;
  page: number;
  pageSize: number;
  loading: boolean;
  error: string | null;
  filters: CarFilterParams;
}

export const useCarsStore = defineStore('cars', {
  state: (): CarsState => ({
    cars: [],
    currentCar: null,
    total: 0,
    page: 1,
    pageSize: 20,
    loading: false,
    error: null,
    filters: {},
  }),

  getters: {
    totalPages: (state): number => Math.ceil(state.total / state.pageSize),
  },

  actions: {
    async fetchCars(filters?: CarFilterParams) {
      this.loading = true;
      this.error = null;
      if (filters) this.filters = { ...this.filters, ...filters };
      try {
        const result = await carsApi.getCars({ ...this.filters, page: this.page, pageSize: this.pageSize });
        this.cars = result.data;
        this.total = result.total;
      } catch (err: any) {
        this.error = err.response?.data?.message || 'Failed to fetch cars';
      } finally {
        this.loading = false;
      }
    },

    async fetchCar(id: string) {
      this.loading = true;
      this.error = null;
      try {
        this.currentCar = await carsApi.getCar(id);
      } catch (err: any) {
        this.error = err.response?.data?.message || 'Failed to fetch car';
      } finally {
        this.loading = false;
      }
    },

    setPage(page: number) {
      this.page = page;
      this.fetchCars();
    },

    resetFilters() {
      this.filters = {};
      this.page = 1;
      this.fetchCars();
    },
  },
});
