
// Re-export all admin-related services from specialized modules
// This maintains backward compatibility with existing imports

export * from './authService';
export * from './productService';
export * from './userService';
export * from './orderService';
export * from './analyticsService';
export * from './ticketService';
export * from './messageService';
export { apiWrapper } from './utils/apiUtils';
