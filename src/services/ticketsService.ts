
import { apiClient } from "./apiClient";

export const getTickets = async () => {
  const response = await apiClient.get('/api/tickets');
  return response.data;
};

export const getTicketById = async (ticketId: string) => {
  const response = await apiClient.get(`/api/ticket/${ticketId}`);
  return response.data;
};

export const createTicket = async (ticketData: any) => {
  const response = await apiClient.post('/api/create-ticket', ticketData);
  return response.data;
};

export const updateTicket = async (ticketData: any) => {
  const response = await apiClient.put('/api/update-ticket', ticketData);
  return response.data;
};

export const deleteTicket = async (ticketId: string) => {
  const response = await apiClient.delete(`/api/ticket/${ticketId}`);
  return response.data;
};

export const assignTicket = async (ticketId: string, adminId: string) => {
  const response = await apiClient.put('/api/assign-ticket', { ticket_id: ticketId, admin_id: adminId });
  return response.data;
};

export const closeTicket = async (ticketId: string) => {
  const response = await apiClient.put('/api/close-ticket', { ticket_id: ticketId });
  return response.data;
};
