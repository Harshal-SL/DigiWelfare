import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, ArrowLeft, FileText, Upload, CheckCircle2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { schemes, applications } from "@/data/mockData";
import OTPVerification from "@/components/OTPVerification";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import AcknowledgmentReceipt from "@/components/AcknowledgmentReceipt";
import { blockchainService } from "@/services/blockchainService";
import { ApplicationStatusBar } from '@/components/ApplicationStatusBar';

// Define interfaces for better type safety
interface User {
  id: string;
  name: string;
  email: string;
  address?: string;
}

interface Application {
  id: string;
  schemeId: string;
  userId: string;
  userName: string;
  status: "pending" | "approved" | "rejected";
  submittedAt: string;
  documents: string[];
  additionalInfo: string;
  eligibilityScore: number;
}

const SchemeApplicationPage = () => {
  const { schemeId } = useParams<{ schemeId: string }>();
  const navigate = useNavigate();
  const { user, isLoggedIn } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [scheme, setScheme] = useState(schemes.find(s => s.id === schemeId));
  const [additionalInfo, setAdditionalInfo] = useState("");
  const [documents, setDocuments] = useState<File[]>([]);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState(user?.email || "");
  const [showEmailOTP, setShowEmailOTP] = useState(false);
  const [showPhoneOTP, setShowPhoneOTP] = useState(false);
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [isPhoneVerified, setIsPhoneVerified] = useState(false);
  const [showAcknowledgment, setShowAcknowledgment] = useState(false);
  const [applicationData, setApplicationData] = useState<any>(null);

  useEffect(() => {
    if (!isLoggedIn) {
      toast.error("Please login to apply for this scheme");
      navigate("/login");
      return;
    }

    if (!scheme) {
      toast.error("Scheme not found");
      navigate("/schemes");
      return;
    }
  }, [isLoggedIn, navigate, scheme]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setDocuments(Array.from(e.target.files));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // Validate required fields
      if (!phoneNumber) {
        toast.error("Please enter your phone number");
        return;
      }
      
      if (!email) {
        toast.error("Please enter your email");
        return;
      }
      
      if (!isEmailVerified) {
        toast.error("Please verify your email");
        return;
      }
      
      if (!isPhoneVerified) {
        toast.error("Please verify your phone number");
        return;
      }
      
      if (documents.length === 0) {
        toast.error("Please upload the required documents");
        return;
      }

      // Generate application number
      const applicationNumber = `DW${Date.now()}${Math.floor(Math.random() * 1000)}`;
      
      // Create submission data
      const submissionData = {
        applicationNumber,
        schemeName: scheme?.title || "",
        applicantName: user?.name || "",
        dateOfSubmission: new Date().toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        }),
        applicantEmail: email,
        applicantPhone: phoneNumber,
        applicantAddress: user?.address || "",
        status: 'Submitted'
      };

      // Create application object for local state
      const newApplication: Application = {
        id: applicationNumber,
        schemeId: scheme?.id || "",
        userId: user?.id || "",
        userName: user?.name || "",
        status: "pending",
        submittedAt: new Date().toISOString(),
        documents: documents.map(doc => doc.name), // Store only document names
        additionalInfo: additionalInfo,
        eligibilityScore: Math.floor(Math.random() * 100)
      };

      // Log to blockchain
      const blockchainData = {
        applicationId: applicationNumber,
        schemeName: scheme?.title || "",
        applicantName: user?.name || "",
        applicantEmail: email,
        documents,
        status: 'Submitted'
      };

      const blockchainResult = await blockchainService.logApplication(blockchainData);
      
      if (!blockchainResult) {
        throw new Error("Failed to log application to blockchain");
      }

      // Add application to applications array
      applications.push(newApplication);

      // Show success message
      toast.success("Application submitted successfully!");

      // Navigate directly to payment page without showing acknowledgment
      navigate('/payment', {
        state: { 
          applicationData: submissionData,
          applicationNumber: applicationNumber,
          blockchainHash: blockchainResult.hash
        }
      });

    } catch (error) {
      console.error("Error submitting application:", error);
      toast.error("Failed to submit application. Please try again.");
    }
  };

  if (!scheme || !isLoggedIn) {
    return null; // Will redirect
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8 bg-[#0f698a] p-6 rounded-lg">
        <h1 className="text-3xl font-bold text-white">Apply for {scheme?.title}</h1>
        <p className="text-white mt-2">Complete the application form to apply for this welfare scheme.</p>
      </div>
      <div className="max-w-2xl mx-auto">
        {/* Add status bar at the top */}
        <ApplicationStatusBar currentStep="application" />
        
        <Card className="shadow-2xl hover:shadow-3xl transition-all duration-300 border-0">
          <CardHeader className="bg-gradient-to-r from-[#0f698a] to-[#0f698a] text-white rounded-t-lg">
            <div className="flex items-center gap-3 mb-3">
              {!showAcknowledgment && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => navigate(`/schemes/${schemeId}`)}
                  className="text-white hover:bg-white/20"
                >
                  <ArrowLeft className="h-5 w-5" />
                </Button>
              )}
              <CardTitle className="text-3xl font-bold">
                {showAcknowledgment ? "Application Submitted" : `Apply for ${scheme?.title}`}
              </CardTitle>
            </div>
            <CardDescription className="text-blue-100">
              {showAcknowledgment 
                ? "Your application has been successfully submitted. Please download your acknowledgment receipt."
                : "Please fill out the application form and upload the required documents."}
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-8 bg-white rounded-b-lg">
            {showAcknowledgment ? (
              <div className="animate-fadeIn">
                <AcknowledgmentReceipt applicationData={applicationData} />
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-10">
                {/* Progress Indicator */}
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-2">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${isEmailVerified && isPhoneVerified ? 'bg-[#0f698a]' : 'bg-[#0f698a]'} text-white`}>
                      1
                    </div>
                    <span className="text-sm font-medium">Contact Verification</span>
                  </div>
                  <div className="flex-1 h-1 bg-gray-200 mx-4">
                    <div className={`h-full ${isEmailVerified && isPhoneVerified ? 'bg-[#0f698a]' : 'bg-[#0f698a]'} transition-all duration-500`} style={{ width: isEmailVerified && isPhoneVerified ? '100%' : '50%' }}></div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${documents.length > 0 ? 'bg-[#0f698a]' : 'bg-[#0f698a]'} text-white`}>
                      2
                    </div>
                    <span className="text-sm font-medium">Documents</span>
                  </div>
                </div>

                {/* Basic Information */}
                <div className="space-y-6 bg-white p-8 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-300">
                  <h3 className="font-semibold text-xl text-gray-800 flex items-center gap-3">
                    <span className="w-3 h-3 bg-[#0f698a] rounded-full"></span>
                    Basic Information
                  </h3>
                  <div className="grid gap-8 md:grid-cols-2">
                    <div className="space-y-3">
                      <Label htmlFor="name" className="text-gray-700 font-medium">Full Name</Label>
                      <Input
                        id="name"
                        value={user?.name || ""}
                        disabled
                        className="bg-gray-50 border-gray-200 focus:border-[#0f698a] focus:ring-1 focus:ring-[#0f698a]"
                      />
                    </div>
                    <div className="space-y-3">
                      <Label htmlFor="email" className="text-gray-700 font-medium">Email</Label>
                      <div className="flex gap-2">
                        <Input
                          id="email"
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="Enter your email"
                          required
                          disabled={isEmailVerified}
                          className="bg-gray-50 border-gray-200 focus:border-[#0f698a] focus:ring-1 focus:ring-[#0f698a]"
                        />
                        {!isEmailVerified && (
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => setShowEmailOTP(true)}
                            className="hover:bg-[#0f698a]/10 border-[#0f698a] text-[#0f698a]"
                          >
                            Verify
                          </Button>
                        )}
                        {isEmailVerified && (
                          <span className="text-green-600 text-sm flex items-center gap-2 bg-green-50 px-3 py-1 rounded-full">
                            <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                            Verified
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="space-y-3">
                      <Label htmlFor="phone" className="text-gray-700 font-medium">Phone Number</Label>
                      <div className="flex gap-2">
                        <Input
                          id="phone"
                          type="tel"
                          value={phoneNumber}
                          onChange={(e) => setPhoneNumber(e.target.value)}
                          placeholder="Enter your phone number"
                          required
                          disabled={isPhoneVerified}
                          className="bg-gray-50 border-gray-200 focus:border-[#0f698a] focus:ring-1 focus:ring-[#0f698a]"
                        />
                        {!isPhoneVerified && (
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => {
                              if (!phoneNumber) {
                                toast.error("Please enter a phone number first");
                                return;
                              }
                              setShowPhoneOTP(true);
                            }}
                            className="hover:bg-[#0f698a]/10 border-[#0f698a] text-[#0f698a]"
                          >
                            Verify
                          </Button>
                        )}
                        {isPhoneVerified && (
                          <span className="text-green-600 text-sm flex items-center gap-2 bg-green-50 px-3 py-1 rounded-full">
                            <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                            Verified
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Required Documents */}
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="documents">Required Documents</Label>
                    <div className="mt-2 space-y-2">
                      {scheme?.documents.map((doc, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <input
                            type="file"
                            id={`document-${index}`}
                            className="hidden"
                            onChange={(e) => handleFileChange(e)}
                          />
                          <label
                            htmlFor={`document-${index}`}
                            className="flex-1 p-2 border rounded-md cursor-pointer hover:bg-gray-50"
                          >
                            {doc}
                          </label>
                          {documents.find(d => d.name.toLowerCase().includes(doc.toLowerCase())) && (
                            <span className="text-green-500">
                              <CheckCircle2 className="h-5 w-5" />
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <Button 
                      type="submit" 
                      className="bg-[#0f698a] hover:bg-[#0a3f56] text-white"
                    >
                      Submit Application
                    </Button>
                  </div>
                </div>
              </form>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Email OTP Dialog */}
      <Dialog open={showEmailOTP} onOpenChange={setShowEmailOTP}>
        <DialogContent className="sm:max-w-md bg-white rounded-xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-gray-800">Verify Email</DialogTitle>
          </DialogHeader>
          <OTPVerification
            type="email"
            value={email}
            onVerified={() => {
              setIsEmailVerified(true);
              setShowEmailOTP(false);
            }}
            onCancel={() => setShowEmailOTP(false)}
          />
        </DialogContent>
      </Dialog>

      {/* Phone OTP Dialog */}
      <Dialog open={showPhoneOTP} onOpenChange={setShowPhoneOTP}>
        <DialogContent className="sm:max-w-md bg-white rounded-xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-gray-800">Verify Phone Number</DialogTitle>
          </DialogHeader>
          <OTPVerification
            type="phone"
            value={phoneNumber}
            onVerified={() => {
              setIsPhoneVerified(true);
              setShowPhoneOTP(false);
              toast.success("Phone number verified successfully!");
            }}
            onCancel={() => setShowPhoneOTP(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SchemeApplicationPage; 