
// import { Credentials, AdminData } from "../types/admin";
// import { delay } from "./utils/apiUtils";
// import { mockAdmins } from "./mockData";

// // Admin Authentication
// export const adminSignup = async (credentials: Credentials) => {
//   await delay(1000);
//   const existingAdmin = mockAdmins.find(admin => admin.email === credentials.email);
//   if (existingAdmin) {
//     throw new Error("Admin with this email already exists");
//   }
  
//   const newAdmin = {
//     id: (mockAdmins.length + 1).toString(),
//     name: "New Admin",
//     email: credentials.email,
//     role: "admin",
//     createdAt: new Date().toISOString().split('T')[0]
//   };
  
//   mockAdmins.push(newAdmin);
//   localStorage.setItem("adminToken", "mock-jwt-token");
//   localStorage.setItem("adminUser", JSON.stringify(newAdmin));
  
//   return { admin: newAdmin, token: "mock-jwt-token" };
// };

// export const adminLogin = async (credentials: Credentials) => {
//   await delay(1000);
//   // Demo admin credentials check
//   if (
//     credentials.email === "admin@example.com" &&
//     credentials.password === "admin123"
//   ) 
//   {
//     const demoAdmin = {
//       id: "demo",
//       name: "Demo Admin",
//       email: "admin@example.com",
//       role: "admin",
//       createdAt: new Date().toISOString().split("T")[0],
//     };
//     localStorage.setItem("adminToken", "demo-admin-token");
//     localStorage.setItem("adminUser", JSON.stringify(demoAdmin));
//     return { admin: demoAdmin, token: "demo-admin-token" };
//   }
//   const admin = mockAdmins.find(admin => admin.email === credentials.email);
  
//   if (!admin) {
//     throw new Error("Invalid credentials");
//   }
  
//   localStorage.setItem("adminToken", "mock-jwt-token");
//   localStorage.setItem("adminUser", JSON.stringify(admin));
  
//   return { admin, token: "mock-jwt-token" };
// };

// export const adminLogout = async () => {
//   await delay(500);
//   localStorage.removeItem("adminToken");
//   localStorage.removeItem("adminUser");
//   return { success: true };
// };

// export const verifyAdmin = async () => {
//   await delay(500);
//   const token = localStorage.getItem("adminToken");
//   const adminUser = localStorage.getItem("adminUser");
  
//   if (!token || !adminUser) {
//     throw new Error("Not authenticated");
//   }
  
//   return { admin: JSON.parse(adminUser), isAuthenticated: true };
// };

// export const forgotPassword = async (email: string) => {
//   await delay(1000);
//   const admin = mockAdmins.find(admin => admin.email === email);
  
//   if (!admin) {
//     throw new Error("Admin not found");
//   }
  
//   // In a real implementation, this would send an email with a reset token
//   return { success: true, message: "Password reset instructions sent to your email" };
// };

// export const verifyPasswordResetToken = async (token: string) => {
//   await delay(800);
//   // In a real implementation, verify the token
//   return { valid: true };
// };

// export const resetPassword = async (token: string, newPassword: string) => {
//   await delay(1000);
//   // In a real implementation, update the password in the database
//   return { success: true, message: "Password successfully reset" };
// };
// export const changePassword = async (token: string, newPassword: string) => {
//   await delay(1000);
//   // In a real implementation, this would update the password in the database
//   return { success: true, message: "Password successfully changed" };
// };

// // Admin Management
// export const getAdmins = async () => {
//   await delay(800);
//   return { admins: mockAdmins };
// };

// export const getAdminById = async (id: string) => {
//   await delay(800);
//   const admin = mockAdmins.find(admin => admin.id === id);
  
//   if (!admin) {
//     throw new Error("Admin not found");
//   }
  
//   return { admin };
// };

// export const updateAdmin = async (id: string, data: Partial<AdminData>) => {
//   await delay(1000);
//   const adminIndex = mockAdmins.findIndex(admin => admin.id === id);
  
//   if (adminIndex === -1) {
//     throw new Error("Admin not found");
//   }
  
//   mockAdmins[adminIndex] = { ...mockAdmins[adminIndex], ...data };
//   return { admin: mockAdmins[adminIndex] };
// };

// export const deleteAdmin = async (id: string) => {
//   await delay(1000);
//   const adminIndex = mockAdmins.findIndex(admin => admin.id === id);
  
//   if (adminIndex === -1) {
//     throw new Error("Admin not found");
//   }
  
//   mockAdmins.splice(adminIndex, 1);
//   return { success: true };
// };


import { apiClient } from "./apiClient";
import { AUTH_ENDPOINTS, ADMIN_ENDPOINTS } from "@/config/api";

interface SignupData {
  name: string;
  email: string;
  password: string;
  code:string;
}

interface LoginData {
  email: string;
  password: string;
}

interface VerifyCodeData {
  email: string;
  code: string;
}

interface ForgotPasswordData {
  email: string;
 resetCode: string;
}

interface ApproveForgotPasswordData {
  email: string;
  code: string;
}

interface ChangePasswordData {
  email: string;
  oldPassword: string;
  newPassword: string;
}


// Helper function for API requests with environment-aware logging
const apiRequest = async (url: string, method: string, data?: any) => {
  try {
    // For debugging in development only
    if (import.meta.env.DEV) {
      console.log(`Making ${method} request to: ${url}`);
      if (data) console.log('Request data:', data);
    }

    const response = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
      },
      body: data ? JSON.stringify(data) : undefined,
      credentials: 'include', // Important for cookies/sessions
    });

    const responseData = await response.json();

    return responseData;
  } catch (error) {
    console.error('API request error:', error);
    throw error;
  }
};

export const adminSignup = async (data: SignupData) => {
  return await apiRequest(AUTH_ENDPOINTS.SIGNUP, 'POST', data);
};

export const adminLogin = async (data: LoginData) => {
  return await apiRequest(AUTH_ENDPOINTS.LOGIN, 'POST', data);
};

export const adminVerifyCode = async (data: VerifyCodeData) => {
  return await apiRequest(AUTH_ENDPOINTS.VERIFY_CODE, 'POST', data);
};

export const adminLogout = async () => {
  return await apiRequest(AUTH_ENDPOINTS.LOGOUT, 'POST');
};

export const forgotPassword = async (data: ForgotPasswordData) => {
  return await apiRequest(AUTH_ENDPOINTS.FORGOT_PASSWORD, 'POST', data);
};

export const adminApproveForgotPassword = async (data: ApproveForgotPasswordData) => {
  return await apiRequest(AUTH_ENDPOINTS.APPROVE_FORGOT_PASSWORD, 'POST', data);
};

export const adminChangePassword = async (data: ChangePasswordData) => {
  return await apiRequest(AUTH_ENDPOINTS.CHANGE_PASSWORD, 'POST', data);
};

export const getAdmins = async () => {
  return await apiRequest(ADMIN_ENDPOINTS.GET_ALL, 'GET');
};

export const getAdminProfile = async (id: string) => {
  return await apiRequest(ADMIN_ENDPOINTS.GET_BY_ID(id), 'GET');
};

export const updateAdmin = async (id: string, AdminData: any) => {
  return await apiRequest(ADMIN_ENDPOINTS.UPDATE(id), 'PUT', AdminData);
};

export const deleteAdmin = async (id: string) => {
  return await apiRequest(ADMIN_ENDPOINTS.DELETE(id), 'DELETE');
};

export const verifyAdmin = async () => {
  return await apiRequest(AUTH_ENDPOINTS.VERIFY_ADMIN, 'GET');
};

export const verifyAdminPasswordChange = async () => {
  return await apiRequest(AUTH_ENDPOINTS.VERIFY_PASSWORD_CHANGE, 'GET');
};