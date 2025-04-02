
import { apiClient } from "./apiClient";

export const getDigitalProducts = async () => {
  const response = await apiClient.get('/api/digital-products');
  return response.data;
};

export const getDigitalProductById = async (id: string) => {
  const response = await apiClient.get(`/api/digital-products/${id}`);
  return response.data;
};

export const createDigitalProduct = async (productData: any) => {
  const response = await apiClient.post('/api/create-digital-products', productData);
  return response.data;
};

export const updateDigitalProduct = async (id: string, productData: any) => {
  const response = await apiClient.put(`/api/digital-products/${id}`, productData);
  return response.data;
};

export const deleteDigitalProduct = async (id: string) => {
  const response = await apiClient.delete(`/api/digital-products/${id}`);
  return response.data;
};

// File uploads for digital products
export const uploadDigitalFiles = async (formData: FormData) => {
  const response = await apiClient.post('/api/upload-files', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
  return response.data;
};
