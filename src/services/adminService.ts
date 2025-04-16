
// Re-export all admin-related services from specialized modules
// This maintains backward compatibility with existing imports

export * from './authService';
export * from './productService';
export * from './digitalProductsService';
export * from './ticketService';
export * from './messageService';
export { apiWrapper } from './utils/apiUtils';
export { getAllUsers } from './userService';
export { getMetrics, getOrders } from './analyticsService';
