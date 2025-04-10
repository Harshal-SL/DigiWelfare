
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { Loader2, KeyRound, User } from "lucide-react";
import { DigilockerSimulator } from "@/components/DigilockerSimulator";

const RegisterPage = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [aadhaarNumber, setAadhaarNumber] = useState("");
  const [hasConsented, setHasConsented] = useState(false);
  const [showDigilocker, setShowDigilocker] = useState(false);
  const { isLoggedIn } = useAuth();

  // If the user is already logged in, redirect them to the dashboard
  if (isLoggedIn) {
    navigate("/dashboard");
  }

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!email || !password || !confirmPassword || !aadhaarNumber) {
      toast.error("Please fill in all fields");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    if (!hasConsented) {
      toast.error("Please consent to the terms and DigiLocker access");
      return;
    }

    // Validate Aadhaar format (12 digits)
    const aadhaarRegex = /^\d{12}$/;
    if (!aadhaarRegex.test(aadhaarNumber)) {
      toast.error("Please enter a valid 12-digit Aadhaar number");
      return;
    }

    // Show DigiLocker simulator
    setShowDigilocker(true);
  };

  const handleDigilockerSuccess = (userData: any) => {
    setIsLoading(true);
    
    // Simulate API call delay
    setTimeout(() => {
      toast.success("Registration successful! Redirecting to profile setup");
      
      // Store user data in localStorage to simulate a successful registration
      localStorage.setItem("tempUserData", JSON.stringify({
        email,
        aadhaarId: aadhaarNumber,
        ...userData
      }));
      
      setIsLoading(false);
      navigate("/profile-setup");
    }, 1500);
  };

  return (
    <div className="min-h-[calc(100vh-200px)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <div className="flex justify-center mb-4">
            <div className="bg-welfare-500 text-white p-3 rounded-md">
              <KeyRound size={28} />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold text-center">Create an Account</CardTitle>
          <CardDescription className="text-center">
            Sign up using your email and connect your Aadhaar via DigiLocker
          </CardDescription>
        </CardHeader>
        <CardContent>
          {showDigilocker ? (
            <DigilockerSimulator 
              aadhaarNumber={aadhaarNumber} 
              onSuccess={handleDigilockerSuccess} 
              onCancel={() => setShowDigilocker(false)}
            />
          ) : (
            <form onSubmit={handleRegisterSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your.email@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="aadhaar">Aadhaar Number</Label>
                <Input
                  id="aadhaar"
                  type="text"
                  placeholder="123456789012"
                  value={aadhaarNumber}
                  onChange={(e) => setAadhaarNumber(e.target.value)}
                  required
                  maxLength={12}
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Your 12-digit Aadhaar number will be used to fetch your details from DigiLocker
                </p>
              </div>
              
              <div className="flex items-center space-x-2 mt-4">
                <Checkbox 
                  id="terms" 
                  checked={hasConsented}
                  onCheckedChange={(checked) => {
                    setHasConsented(checked as boolean);
                  }}
                />
                <label
                  htmlFor="terms"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  I consent to access my DigiLocker and agree to the terms of service
                </label>
              </div>
              
              <Button type="submit" className="w-full mt-6" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <User className="mr-2 h-4 w-4" />
                    Register
                  </>
                )}
              </Button>
            </form>
          )}
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <div className="text-sm text-center mt-2">
            Already have an account?{" "}
            <a 
              href="/login" 
              className="text-welfare-600 hover:text-welfare-500 font-semibold"
            >
              Sign in
            </a>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default RegisterPage;
