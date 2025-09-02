import axiosInstance from './axiosInstance'
import type { AxiosRequestConfig } from 'axios'

export const httpService = {
  get: async <T>(url: string, params?: object): Promise<T> => {
    return axiosInstance.get(url, { params })
  },

  post: async <T>(url: string, data: object,config?:AxiosRequestConfig): Promise<T> => {
    return axiosInstance.post(url, data,config)
  },

  put: async <T>(url: string, data: object): Promise<T> => {
    return axiosInstance.put(url, data)
  },

  delete: async <T>(url: string): Promise<T> => {
    return axiosInstance.delete(url)
  },

  patch: async <T>(url: string, data: object): Promise<T> => {
    return axiosInstance.patch(url, data)
  },
}

export default httpService
