
import { Credentials, AdminData } from "../types/admin";
import { delay } from "./utils/apiUtils";
import { mockAdmins } from "./mockData";

// Admin Authentication
export const adminSignup = async (credentials: Credentials) => {
  await delay(1000);
  const existingAdmin = mockAdmins.find(admin => admin.email === credentials.email);
  if (existingAdmin) {
    throw new Error("Admin with this email already exists");
  }
  
  const newAdmin = {
    id: (mockAdmins.length + 1).toString(),
    name: "New Admin",
    email: credentials.email,
    role: "admin",
    createdAt: new Date().toISOString().split('T')[0]
  };
  
  mockAdmins.push(newAdmin);
  localStorage.setItem("adminToken", "mock-jwt-token");
  localStorage.setItem("adminUser", JSON.stringify(newAdmin));
  
  return { admin: newAdmin, token: "mock-jwt-token" };
};

export const adminLogin = async (credentials: Credentials) => {
  await delay(1000);
  const admin = mockAdmins.find(admin => admin.email === credentials.email);
  
  if (!admin) {
    throw new Error("Invalid credentials");
  }
  
  localStorage.setItem("adminToken", "mock-jwt-token");
  localStorage.setItem("adminUser", JSON.stringify(admin));
  
  return { admin, token: "mock-jwt-token" };
};

export const adminLogout = async () => {
  await delay(500);
  localStorage.removeItem("adminToken");
  localStorage.removeItem("adminUser");
  return { success: true };
};

export const verifyAdmin = async () => {
  await delay(500);
  const token = localStorage.getItem("adminToken");
  const adminUser = localStorage.getItem("adminUser");
  
  if (!token || !adminUser) {
    throw new Error("Not authenticated");
  }
  
  return { admin: JSON.parse(adminUser), isAuthenticated: true };
};

export const forgotPassword = async (email: string) => {
  await delay(1000);
  const admin = mockAdmins.find(admin => admin.email === email);
  
  if (!admin) {
    throw new Error("Admin not found");
  }
  
  // In a real implementation, this would send an email with a reset token
  return { success: true, message: "Password reset instructions sent to your email" };
};

export const verifyPasswordResetToken = async (token: string) => {
  await delay(800);
  // In a real implementation, this would verify the token
  return { valid: true };
};

export const changePassword = async (token: string, newPassword: string) => {
  await delay(1000);
  // In a real implementation, this would update the password in the database
  return { success: true, message: "Password successfully changed" };
};

// Admin Management
export const getAdmins = async () => {
  await delay(800);
  return { admins: mockAdmins };
};

export const getAdminById = async (id: string) => {
  await delay(800);
  const admin = mockAdmins.find(admin => admin.id === id);
  
  if (!admin) {
    throw new Error("Admin not found");
  }
  
  return { admin };
};

export const updateAdmin = async (id: string, data: Partial<AdminData>) => {
  await delay(1000);
  const adminIndex = mockAdmins.findIndex(admin => admin.id === id);
  
  if (adminIndex === -1) {
    throw new Error("Admin not found");
  }
  
  mockAdmins[adminIndex] = { ...mockAdmins[adminIndex], ...data };
  return { admin: mockAdmins[adminIndex] };
};

export const deleteAdmin = async (id: string) => {
  await delay(1000);
  const adminIndex = mockAdmins.findIndex(admin => admin.id === id);
  
  if (adminIndex === -1) {
    throw new Error("Admin not found");
  }
  
  mockAdmins.splice(adminIndex, 1);
  return { success: true };
};
