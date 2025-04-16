
import { delay } from "./utils/apiUtils";

interface CreateTicketData {
  subject: string;
  message: string;
  category: string;
  user_id: string;
}

export const createTicket = async (ticketData: CreateTicketData) => {
  await delay(1000);
  
  // In a real app, this would call an API to create the ticket
  return { 
    ticketId: Math.random().toString(36).substring(2, 15),
    messageId: Math.random().toString(36).substring(2, 15)
  };
};

export const getUserTickets = async (userId: string) => {
  await delay(800);
  
  // In a real app, this would fetch the user's tickets from an API
  return [
    {
      id: "ticket-1",
      subject: "Account Issue",
      status: "open",
      category: "account",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      unreadCount: 2
    },
    {
      id: "ticket-2",
      subject: "Payment Problem",
      status: "closed",
      category: "billing",
      createdAt: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
      updatedAt: new Date(Date.now() - 43200000).toISOString(), // 12 hours ago
      unreadCount: 0
    }
  ];
};

export const ticketService = {
  createTicket,
  getUserTickets
};
