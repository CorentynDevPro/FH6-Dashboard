import apiClient from './axios';
import type { Car, CarListResponse, CarFilterParams, UserCar } from '@fh6/types';

export const carsApi = {
  async getCars(params?: CarFilterParams): Promise<CarListResponse> {
    const res = await apiClient.get<CarListResponse>('/cars', { params });
    return res.data;
  },

  async getCar(id: string): Promise<Car> {
    const res = await apiClient.get<Car>(`/cars/${id}`);
    return res.data;
  },

  async createCar(data: Partial<Car>): Promise<Car> {
    const res = await apiClient.post<Car>('/cars', data);
    return res.data;
  },

  async updateCar(id: string, data: Partial<Car>): Promise<Car> {
    const res = await apiClient.put<Car>(`/cars/${id}`, data);
    return res.data;
  },

  async deleteCar(id: string): Promise<void> {
    await apiClient.delete(`/cars/${id}`);
  },
};

export const collectionApi = {
  async getCollection(): Promise<UserCar[]> {
    const res = await apiClient.get<UserCar[]>('/collection');
    return res.data;
  },

  async addCar(carId: string, notes?: string): Promise<UserCar> {
    const res = await apiClient.post<UserCar>(`/collection/${carId}`, { notes });
    return res.data;
  },

  async removeCar(carId: string): Promise<void> {
    await apiClient.delete(`/collection/${carId}`);
  },
};
