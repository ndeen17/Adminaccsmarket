
import { apiClient } from "./apiClient";
import { delay } from "./utils/apiUtils";
import { mockMessages } from "./mockData";

export interface Message {
  id: string;
  ticketId: string;
  content: string;
  sender: 'user' | 'admin';
  timestamp: string;
  seen: boolean;
  attachments?: string[];
}

// Message Management
export const getMessages = async (ticketId: string) => {
  await delay(800);
  const messages = mockMessages.filter(message => message.ticketId === ticketId);
  return { messages };
};

export const getAllMessages = async () => {
  await delay(800);
  return { messages: mockMessages };
};

export const sendMessage = async (messageData: Omit<Message, 'id' | 'timestamp' | 'seen'>) => {
  await delay(1000);
  const newMessage: Message = {
    ...messageData,
    id: (mockMessages.length + 1).toString(),
    timestamp: new Date().toISOString(),
    seen: false
  };
  
  mockMessages.push(newMessage as any);
  return newMessage;
};

export const markAsSeen = async (messageId: string) => {
  await delay(800);
  const messageIndex = mockMessages.findIndex(message => message.id === messageId);
  
  if (messageIndex === -1) {
    throw new Error("Message not found");
  }
  
  mockMessages[messageIndex].seenByAdmin = true;
  return { message: mockMessages[messageIndex] };
};

export const fetchMessages = async ({ ticketId }: { ticketId: string }) => {
  await delay(800);
  const messages = mockMessages.filter(message => message.ticketId === ticketId);
  return messages as Message[];
};

export const messageService = {
  getMessages,
  getAllMessages,
  sendMessage,
  markAsSeen,
  fetchMessages
};
