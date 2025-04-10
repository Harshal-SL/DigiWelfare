
import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { toast } from "sonner";

// Define user type
type User = {
  id: string;
  name: string;
  email: string;
  role: "user" | "admin";
  aadhaarId?: string;
};

type AuthContextType = {
  user: User | null;
  isLoggedIn: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  adminLogin: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check if the user is logged in on component mount
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  // Simulate login for demo purposes
  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Validate credentials (in a real app, this would be done on the server)
      if (email === "user@example.com" && password === "password") {
        const userData: User = {
          id: "user-1",
          name: "John Doe",
          email: "user@example.com",
          role: "user",
          aadhaarId: "1234-5678-9012"
        };
        
        setUser(userData);
        localStorage.setItem("user", JSON.stringify(userData));
        toast.success("Login successful!");
        return true;
      }
      
      toast.error("Invalid credentials");
      return false;
    } catch (error) {
      console.error("Login error:", error);
      toast.error("An error occurred during login");
      return false;
    } finally {
      setIsLoading(false);
    }
  };
  
  // Simulate admin login
  const adminLogin = async (email: string, password: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Validate admin credentials
      if (email === "admin@example.com" && password === "admin123") {
        const adminData: User = {
          id: "admin-1",
          name: "Admin User",
          email: "admin@example.com",
          role: "admin"
        };
        
        setUser(adminData);
        localStorage.setItem("user", JSON.stringify(adminData));
        toast.success("Admin login successful!");
        return true;
      }
      
      toast.error("Invalid admin credentials");
      return false;
    } catch (error) {
      console.error("Admin login error:", error);
      toast.error("An error occurred during admin login");
      return false;
    } finally {
      setIsLoading(false);
    }
  };
  
  // Logout function
  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
    toast.success("Logged out successfully");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoggedIn: !!user,
        isLoading,
        login,
        adminLogin,
        logout
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
