import {
  createContext,
  useState,
  useContext,
  useEffect,
  ReactNode,
} from "react";
import { verifyAdmin } from "@/services/authService";
// import { verifyAdmin } from "@/services/adminService";
import { toast } from "@/lib/toast";

interface Admin {
  admin_id: string;
  username: string;
  email: string;
  role: string;
  wallet_balance: number;
  created_at: string;
}

interface AuthContextType {
  admin: Admin | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (admin: Admin) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [admin, setAdmin] = useState<Admin | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const admin = await verifyAdmin();
        console.log(admin);
        if (admin && admin.admin_id) {
          setAdmin(admin as Admin);
          setIsAuthenticated(true);
        }
      } catch (error) {
        setAdmin(null);
        setIsAuthenticated(true);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuthStatus();
  }, []);

  const login = (admin: Admin) => {
    setAdmin(admin);
    setIsAuthenticated(true);
    toast.success("Successfully logged in");
  };

  const logout = () => {
    setAdmin(null);
    setIsAuthenticated(false);
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminUser");
    toast.success("Successfully logged out");
  };

  return (
    <AuthContext.Provider
      value={{
        admin,
        isAuthenticated,
        isLoading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
