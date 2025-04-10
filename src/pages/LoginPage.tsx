
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";

const LoginPage = () => {
  const [userEmail, setUserEmail] = useState("");
  const [userPassword, setUserPassword] = useState("");
  const [adminEmail, setAdminEmail] = useState("");
  const [adminPassword, setAdminPassword] = useState("");
  const { login, adminLogin, isLoading } = useAuth();
  const navigate = useNavigate();

  const handleUserLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await login(userEmail, userPassword);
    if (success) {
      navigate("/dashboard");
    }
  };

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await adminLogin(adminEmail, adminPassword);
    if (success) {
      navigate("/admin");
    }
  };

  return (
    <div className="min-h-[calc(100vh-200px)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-lg">
        <div className="flex justify-center mb-6">
          <div className="bg-welfare-500 text-white p-3 rounded-md">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        </div>
        <h2 className="text-2xl font-bold text-center mb-6">Log in to AidLedger</h2>
        
        <Tabs defaultValue="user" className="w-full">
          <TabsList className="grid grid-cols-2 mb-6">
            <TabsTrigger value="user">User Login</TabsTrigger>
            <TabsTrigger value="admin">Admin Login</TabsTrigger>
          </TabsList>
          
          <TabsContent value="user">
            <form onSubmit={handleUserLogin}>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="userEmail">Email</Label>
                  <Input
                    id="userEmail"
                    type="email"
                    placeholder="user@example.com"
                    required
                    value={userEmail}
                    onChange={(e) => setUserEmail(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="userPassword">Password</Label>
                    <a href="#" className="text-sm text-welfare-600 hover:text-welfare-500">
                      Forgot password?
                    </a>
                  </div>
                  <Input
                    id="userPassword"
                    type="password"
                    placeholder="••••••••"
                    required
                    value={userPassword}
                    onChange={(e) => setUserPassword(e.target.value)}
                  />
                </div>
                <div className="pt-2">
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Logging in...
                      </>
                    ) : (
                      "Log in"
                    )}
                  </Button>
                </div>
              </div>
            </form>
            <div className="mt-6 text-center text-sm">
              <p className="text-gray-600">
                Demo credentials: <span className="font-semibold">user@example.com / password</span>
              </p>
            </div>
          </TabsContent>
          
          <TabsContent value="admin">
            <form onSubmit={handleAdminLogin}>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="adminEmail">Admin Email</Label>
                  <Input
                    id="adminEmail"
                    type="email"
                    placeholder="admin@example.com"
                    required
                    value={adminEmail}
                    onChange={(e) => setAdminEmail(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="adminPassword">Password</Label>
                    <a href="#" className="text-sm text-welfare-600 hover:text-welfare-500">
                      Forgot password?
                    </a>
                  </div>
                  <Input
                    id="adminPassword"
                    type="password"
                    placeholder="••••••••"
                    required
                    value={adminPassword}
                    onChange={(e) => setAdminPassword(e.target.value)}
                  />
                </div>
                <div className="pt-2">
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Logging in...
                      </>
                    ) : (
                      "Admin Log in"
                    )}
                  </Button>
                </div>
              </div>
            </form>
            <div className="mt-6 text-center text-sm">
              <p className="text-gray-600">
                Demo credentials: <span className="font-semibold">admin@example.com / admin123</span>
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default LoginPage;
