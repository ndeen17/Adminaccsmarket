
import { json } from "stream/consumers";
import { apiClient } from "./apiClient";
import { DIGITAL_PRODUCTS_ENDPOINTS } from "@/config/api";

// Helper function for API requests with environment-aware logging
const apiRequest = async (url: string, method: string, data?: any) => {
  try {
    // For debugging in development only
    if (import.meta.env.DEV) {
      console.log(`Making ${method} request to: ${url}`);
      if (data) console.log('Request data:', data);
    }

    const response = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
      },
      body: data ? JSON.stringify(data) : undefined,
      credentials: 'include', // Important for cookies/sessions
    });

    const responseData = await response.json();

    return responseData;
  } catch (error) {
    console.error('API request error:', error);
    throw error;
  }
};
const apiFormRequest = async (url: string, method: string, data?: any) => {
  try {
    // For debugging in development only
    if (import.meta.env.DEV) {
      console.log(`Making ${method} request to: ${url}`);
      if (data) console.log('Request data:', data);
    }

    const response = await fetch(url, {
      method,
      body: data,
      credentials: 'include', // Important for cookies/sessions
    });

    const responseData = await response.json();

    return responseData;
  } catch (error) {
    console.error('API request error:', error);
    throw error;
  }
};

export const getDigitalProducts = async () => {
  return await apiRequest(DIGITAL_PRODUCTS_ENDPOINTS.GET_ALL, "GET");
};

export const product = async (id: string) => {
  return await apiRequest(DIGITAL_PRODUCTS_ENDPOINTS.GET_BY_ID(id), "GET");
};

export const createDigitalProduct = async (productData: FormData) => {
  return await apiFormRequest(DIGITAL_PRODUCTS_ENDPOINTS.CREATE, "POST", productData);
};

export const updateDigitalProduct = async (id: string, productData: any) => {
  return await apiRequest(DIGITAL_PRODUCTS_ENDPOINTS.UPDATE(id), "PUT", productData);
};

export const deleteDigitalProduct = async (id: string) => {
  return await apiRequest(DIGITAL_PRODUCTS_ENDPOINTS.DELETE(id), "DELETE");
};

// File uploads for digital products
export const downloadDigitalFiles = async (id: string) => {
  return await apiRequest(DIGITAL_PRODUCTS_ENDPOINTS.DOWNLOAD, "GET", id);
};