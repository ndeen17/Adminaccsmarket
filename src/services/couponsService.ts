
import { apiClient } from "./apiClient";

export const getCoupons = async () => {
  const response = await apiClient.get('/api/coupons');
  return response.data;
};

export const getCouponById = async (couponId: string) => {
  const response = await apiClient.get(`/api/coupon/${couponId}`);
  return response.data;
};

export const createCoupon = async (couponData: any) => {
  const response = await apiClient.post('/api/create-coupon', couponData);
  return response.data;
};

export const updateCouponUsed = async (couponId: string) => {
  const response = await apiClient.put(`/api/updateCouponUsed/${couponId}`);
  return response.data;
};

export const updateCouponValue = async (couponId: string, valueData: any) => {
  const response = await apiClient.put(`/api/update-coupon-value/${couponId}`, valueData);
  return response.data;
};

export const deleteCoupon = async (couponId: string) => {
  const response = await apiClient.delete(`/api/delete-coupon/${couponId}`);
  return response.data;
};
