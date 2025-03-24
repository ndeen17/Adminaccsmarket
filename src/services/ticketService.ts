
import { TicketData } from "../types/admin";
import { delay } from "./utils/apiUtils";
import { mockTickets } from "./mockData";

// Ticket Management
export const getTickets = async () => {
  await delay(800);
  return { tickets: mockTickets };
};

export const getTicketById = async (id: string) => {
  await delay(800);
  const ticket = mockTickets.find(ticket => ticket.id === id);
  
  if (!ticket) {
    throw new Error("Ticket not found");
  }
  
  return { ticket };
};

export const createTicket = async (ticketData: Omit<TicketData, 'id' | 'createdAt' | 'lastUpdated'>) => {
  await delay(1000);
  const newTicket: TicketData = {
    ...ticketData,
    id: (mockTickets.length + 1).toString(),
    createdAt: new Date().toISOString().split('T')[0],
    lastUpdated: new Date().toISOString().split('T')[0]
  };
  
  mockTickets.push(newTicket);
  return { ticket: newTicket };
};

export const updateTicket = async (id: string, ticketData: Partial<TicketData>) => {
  await delay(1000);
  const ticketIndex = mockTickets.findIndex(ticket => ticket.id === id);
  
  if (ticketIndex === -1) {
    throw new Error("Ticket not found");
  }
  
  mockTickets[ticketIndex] = { 
    ...mockTickets[ticketIndex], 
    ...ticketData,
    lastUpdated: new Date().toISOString().split('T')[0]
  };
  
  return { ticket: mockTickets[ticketIndex] };
};

export const deleteTicket = async (id: string) => {
  await delay(1000);
  const ticketIndex = mockTickets.findIndex(ticket => ticket.id === id);
  
  if (ticketIndex === -1) {
    throw new Error("Ticket not found");
  }
  
  mockTickets.splice(ticketIndex, 1);
  return { success: true };
};

export const assignTicket = async (ticketId: string, adminId: string) => {
  await delay(1000);
  const ticketIndex = mockTickets.findIndex(ticket => ticket.id === ticketId);
  
  if (ticketIndex === -1) {
    throw new Error("Ticket not found");
  }
  
  mockTickets[ticketIndex].assignedTo = adminId;
  mockTickets[ticketIndex].lastUpdated = new Date().toISOString().split('T')[0];
  
  return { ticket: mockTickets[ticketIndex] };
};

export const closeTicket = async (id: string) => {
  await delay(1000);
  const ticketIndex = mockTickets.findIndex(ticket => ticket.id === id);
  
  if (ticketIndex === -1) {
    throw new Error("Ticket not found");
  }
  
  mockTickets[ticketIndex].status = "closed";
  mockTickets[ticketIndex].lastUpdated = new Date().toISOString().split('T')[0];
  
  return { ticket: mockTickets[ticketIndex] };
};
