
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { Loader2, KeyRound, X } from "lucide-react";

// Mock user data that would normally be fetched from DigiLocker
const mockUserData = {
  name: "John Doe",
  gender: "Male",
  dateOfBirth: "1990-05-15",
  address: "123 Main Street, Bangalore, Karnataka - 560001",
  phone: "9876543210",
  email: "john.doe@example.com",
  documents: {
    incomeCertificate: {
      id: "INC123456",
      issueDate: "2023-01-15",
      issuedBy: "Revenue Department",
      status: "valid"
    },
    casteCertificate: {
      id: "CST789012",
      issueDate: "2022-11-10", 
      issuedBy: "Social Welfare Department",
      status: "valid"
    },
    rationCard: {
      id: "RAT345678",
      issueDate: "2021-08-20",
      issuedBy: "Food and Civil Supplies Department",
      status: "valid"
    },
    voterId: {
      id: "VID901234",
      issueDate: "2020-03-05",
      issuedBy: "Election Commission",
      status: "valid"
    }
  }
};

type DigilockerSimulatorProps = {
  aadhaarNumber: string;
  onSuccess: (userData: any) => void;
  onCancel: () => void;
};

export const DigilockerSimulator = ({ 
  aadhaarNumber, 
  onSuccess, 
  onCancel 
}: DigilockerSimulatorProps) => {
  const [stage, setStage] = useState<'otp' | 'connecting' | 'success'>('otp');
  const [value, setValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleVerifyOTP = () => {
    if (value.length !== 6) {
      return;
    }

    setIsLoading(true);
    setStage('connecting');

    // Simulate connection to DigiLocker
    setTimeout(() => {
      setStage('success');
      
      // Simulate another delay before completing
      setTimeout(() => {
        onSuccess(mockUserData);
      }, 1500);
    }, 2000);
  };

  return (
    <Card className="p-4 border-2 border-welfare-100">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2">
          <div className="bg-welfare-500 text-white p-2 rounded-md">
            <KeyRound size={20} />
          </div>
          <h3 className="font-semibold text-lg">DigiLocker Connect</h3>
        </div>
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={onCancel}
          disabled={isLoading}
        >
          <X size={18} />
        </Button>
      </div>
      
      {stage === 'otp' && (
        <div className="space-y-6">
          <div className="bg-welfare-50 rounded-md p-3 text-sm">
            <p>We've sent a 6-digit OTP to the mobile number linked with your Aadhaar {aadhaarNumber.slice(0, 4)}XXXX{aadhaarNumber.slice(-4)}</p>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="otp">Enter OTP</Label>
            <InputOTP 
              maxLength={6} 
              value={value} 
              onChange={(val) => setValue(val)}
              render={({ slots }) => (
                <InputOTPGroup>
                  {slots.map((slot, i) => (
                    <InputOTPSlot key={i} {...slot} index={i} />
                  ))}
                </InputOTPGroup>
              )}
            />
            <p className="text-xs text-muted-foreground mt-1">
              Enter any 6 digits for demo purposes
            </p>
          </div>
          
          <Button 
            onClick={handleVerifyOTP} 
            className="w-full"
            disabled={value.length !== 6 || isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Verifying...
              </>
            ) : "Verify OTP"}
          </Button>
        </div>
      )}
      
      {stage === 'connecting' && (
        <div className="py-8 flex flex-col items-center justify-center space-y-4">
          <Loader2 className="h-12 w-12 animate-spin text-welfare-500" />
          <p className="font-medium">Connecting to DigiLocker...</p>
          <p className="text-sm text-muted-foreground">Fetching your profile information</p>
        </div>
      )}
      
      {stage === 'success' && (
        <div className="py-8 flex flex-col items-center justify-center space-y-4">
          <div className="bg-green-100 text-green-700 p-3 rounded-full">
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              width="30" 
              height="30" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            >
              <path d="M20 6 9 17l-5-5"/>
            </svg>
          </div>
          <p className="font-medium">Connection Successful!</p>
          <p className="text-sm text-muted-foreground text-center">
            Your DigiLocker account is successfully linked.<br />Setting up your profile...
          </p>
          <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
            <div className="bg-welfare-500 h-2.5 rounded-full w-3/4 animate-pulse"></div>
          </div>
        </div>
      )}
    </Card>
  );
};
