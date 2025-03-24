
import { delay } from "./utils/apiUtils";
import { mockUsers } from "./mockData";

// User Management
export const getUsers = async () => {
  await delay(800);
  return { users: mockUsers };
};

export const getUserById = async (id: string) => {
  await delay(800);
  const user = mockUsers.find(user => user.id === id);
  
  if (!user) {
    throw new Error("User not found");
  }
  
  return { user };
};

export const updateUserStatus = async (id: string, status: string) => {
  await delay(1000);
  const userIndex = mockUsers.findIndex(user => user.id === id);
  
  if (userIndex === -1) {
    throw new Error("User not found");
  }
  
  mockUsers[userIndex].status = status;
  return { user: mockUsers[userIndex] };
};
