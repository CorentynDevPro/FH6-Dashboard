import { defineStore } from 'pinia';
import { carsApi, collectionApi } from '@/api/cars.api';
import type { Car, CarFilterParams, UserCar } from '@fh6/types';

interface CarsState {
  cars: Car[];
  currentCar: Car | null;
  total: number;
  page: number;
  pageSize: number;
  loading: boolean;
  error: string | null;
  filters: CarFilterParams;
  myCollection: UserCar[];
  collectionIds: Set<string>;
  collectionLoading: boolean;
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
    myCollection: [],
    collectionIds: new Set<string>(),
    collectionLoading: false,
  }),

  getters: {
    totalPages: (state): number => Math.ceil(state.total / state.pageSize),
    isInCollection: (state) => (carId: string): boolean => state.collectionIds.has(carId),
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

    async fetchCollection() {
      this.collectionLoading = true;
      try {
        this.myCollection = await collectionApi.getCollection();
        this.collectionIds = new Set(this.myCollection.map((uc) => uc.carId));
      } catch (err: any) {
        console.error('Failed to fetch collection', err);
      } finally {
        this.collectionLoading = false;
      }
    },

    async addToCollection(carId: string, notes?: string) {
      const entry = await collectionApi.addCar(carId, notes);
      this.myCollection.unshift(entry);
      this.collectionIds.add(carId);
      return entry;
    },

    async removeFromCollection(carId: string) {
      await collectionApi.removeCar(carId);
      this.myCollection = this.myCollection.filter((uc) => uc.carId !== carId);
      this.collectionIds.delete(carId);
    },

    async createCar(data: Partial<Car>) {
      this.loading = true;
      this.error = null;
      try {
        const car = await carsApi.createCar(data);
        await this.fetchCars();
        return car;
      } catch (err: any) {
        this.error = err.response?.data?.message || 'Failed to create car';
        throw err;
      } finally {
        this.loading = false;
      }
    },
  },
});
