
import { apiClient } from "./apiClient";

export const sendMessageAsAdmin = async (messageData: any) => {
  const response = await apiClient.post('/api/send-message-admin', messageData);
  return response.data;
};

export const getAllMessages = async () => {
  const response = await apiClient.get('/api/fetch-all-messages');
  return response.data;
};

export const getMessagesByTicketId = async (ticketId: string) => {
  const response = await apiClient.get(`/api/messages/${ticketId}`);
  return response.data;
};

export const markMessageSeenByAdmin = async (messageId: string) => {
  const response = await apiClient.put('/api/edit-message-seen-by-admin', { message_id: messageId });
  return response.data;
};

export const uploadMessageFiles = async (formData: FormData) => {
  const response = await apiClient.post('/api/upload-files', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
  return response.data;
};

export const sendEmailNotificationToAdmin = async (emailData: any) => {
  const response = await apiClient.post('/api/send-message-mail-to-admin', emailData);
  return response.data;
};
