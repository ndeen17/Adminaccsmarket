
import { delay } from "./utils/apiUtils";
import { mockOrders } from "./mockData";

// Order Management
export const getOrders = async () => {
  await delay(800);
  return { orders: mockOrders };
};

export const getOrderById = async (id: string) => {
  await delay(800);
  const order = mockOrders.find(order => order.id === id);
  
  if (!order) {
    throw new Error("Order not found");
  }
  
  return { order };
};

export const updateOrderStatus = async (id: string, status: string) => {
  await delay(1000);
  const orderIndex = mockOrders.findIndex(order => order.id === id);
  
  if (orderIndex === -1) {
    throw new Error("Order not found");
  }
  
  mockOrders[orderIndex].status = status;
  return { order: mockOrders[orderIndex] };
};
