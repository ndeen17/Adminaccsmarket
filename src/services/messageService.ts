
import { MessageData } from "../types/admin";
import { delay } from "./utils/apiUtils";
import { mockMessages } from "./mockData";

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

export const sendMessage = async (messageData: Omit<MessageData, 'id' | 'createdAt'>) => {
  await delay(1000);
  const newMessage: MessageData = {
    ...messageData,
    id: (mockMessages.length + 1).toString(),
    createdAt: new Date().toISOString().split('T')[0]
  };
  
  mockMessages.push(newMessage);
  return { message: newMessage };
};

export const markMessageAsSeenByAdmin = async (id: string) => {
  await delay(800);
  const messageIndex = mockMessages.findIndex(message => message.id === id);
  
  if (messageIndex === -1) {
    throw new Error("Message not found");
  }
  
  mockMessages[messageIndex].seenByAdmin = true;
  return { message: mockMessages[messageIndex] };
};
