import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, ArrowLeft, FileText, Upload } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { schemes } from "@/data/mockData";
import OTPVerification from "@/components/OTPVerification";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import AcknowledgmentReceipt from "@/components/AcknowledgmentReceipt";

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

    setIsLoading(true);

    try {
      // Simulate API call to submit application
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const applicationNumber = `DW${Date.now()}${Math.floor(Math.random() * 1000)}`;
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

      // Save application data and show acknowledgment
      setApplicationData(submissionData);
      setShowAcknowledgment(true);
      toast.success("Application submitted successfully!");

    } catch (error) {
      console.error("Error submitting application:", error);
      toast.error("Failed to submit application. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (!scheme || !isLoggedIn) {
    return null; // Will redirect
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <Card className="shadow-2xl hover:shadow-3xl transition-all duration-300 border-0">
          <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-t-lg">
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
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${isEmailVerified && isPhoneVerified ? 'bg-green-500' : 'bg-blue-500'} text-white`}>
                      1
                    </div>
                    <span className="text-sm font-medium">Contact Verification</span>
                  </div>
                  <div className="flex-1 h-1 bg-gray-200 mx-4">
                    <div className={`h-full ${isEmailVerified && isPhoneVerified ? 'bg-green-500' : 'bg-blue-500'} transition-all duration-500`} style={{ width: isEmailVerified && isPhoneVerified ? '100%' : '50%' }}></div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${documents.length > 0 ? 'bg-green-500' : 'bg-blue-500'} text-white`}>
                      2
                    </div>
                    <span className="text-sm font-medium">Documents</span>
                  </div>
                </div>

                {/* Basic Information */}
                <div className="space-y-6 bg-white p-8 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-300">
                  <h3 className="font-semibold text-xl text-gray-800 flex items-center gap-3">
                    <span className="w-3 h-3 bg-blue-500 rounded-full"></span>
                    Basic Information
                  </h3>
                  <div className="grid gap-8 md:grid-cols-2">
                    <div className="space-y-3">
                      <Label htmlFor="name" className="text-gray-700 font-medium">Full Name</Label>
                      <Input
                        id="name"
                        value={user?.name || ""}
                        disabled
                        className="bg-gray-50 border-gray-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
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
                          className="bg-gray-50 border-gray-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                        />
                        {!isEmailVerified && (
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => setShowEmailOTP(true)}
                            className="hover:bg-blue-50 border-blue-200 text-blue-600"
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
                          className="bg-gray-50 border-gray-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
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
                            className="hover:bg-blue-50 border-blue-200 text-blue-600"
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
                <div className="space-y-6 bg-white p-8 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-300">
                  <h3 className="font-semibold text-xl text-gray-800 flex items-center gap-3">
                    <span className="w-3 h-3 bg-blue-500 rounded-full"></span>
                    Required Documents
                  </h3>
                  <div className="grid gap-6 md:grid-cols-2">
                    {scheme.documents.map((doc, index) => (
                      <div key={index} className="space-y-3 p-6 rounded-lg border border-gray-200 hover:border-blue-200 transition-colors duration-200 bg-gray-50">
                        <div className="flex items-center justify-between">
                          <Label className="text-gray-700 font-medium">{doc}</Label>
                          <span className={`text-sm px-3 py-1 rounded-full ${
                            documents.find(d => d.name.toLowerCase().includes(doc.toLowerCase())) 
                              ? "bg-green-50 text-green-600" 
                              : "bg-gray-100 text-gray-500"
                          }`}>
                            {documents.find(d => d.name.toLowerCase().includes(doc.toLowerCase())) 
                              ? "✓ Uploaded" 
                              : "Not uploaded"}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Input
                            type="file"
                            accept=".pdf,.jpg,.jpeg,.png"
                            onChange={(e) => {
                              if (e.target.files && e.target.files[0]) {
                                const file = e.target.files[0];
                                const existingIndex = documents.findIndex(
                                  d => d.name.toLowerCase().includes(doc.toLowerCase())
                                );
                                if (existingIndex >= 0) {
                                  const newDocuments = [...documents];
                                  newDocuments[existingIndex] = file;
                                  setDocuments(newDocuments);
                                } else {
                                  setDocuments([...documents, file]);
                                }
                                toast.success(`${doc} uploaded successfully`);
                              }
                            }}
                            className="cursor-pointer bg-white border-gray-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                          />
                          <Button
                            type="button"
                            variant="outline"
                            size="icon"
                            onClick={() => document.querySelector('input[type="file"]')?.click()}
                            className="hover:bg-blue-50 border-blue-200 text-blue-600"
                          >
                            <Upload className="h-4 w-4" />
                          </Button>
                        </div>
                        {documents.find(d => d.name.toLowerCase().includes(doc.toLowerCase())) && (
                          <div className="flex items-center gap-2 text-sm text-green-600 bg-green-50 p-3 rounded-md">
                            <FileText className="h-4 w-4" />
                            <span className="truncate">
                              {documents.find(d => d.name.toLowerCase().includes(doc.toLowerCase()))?.name}
                            </span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                  <div className="mt-4">
                    <p className="text-sm text-gray-500">
                      Accepted file formats: PDF, JPG, JPEG, PNG
                    </p>
                  </div>
                </div>

                {/* Additional Information */}
                <div className="space-y-6 bg-white p-8 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-300">
                  <h3 className="font-semibold text-xl text-gray-800 flex items-center gap-3">
                    <span className="w-3 h-3 bg-blue-500 rounded-full"></span>
                    Additional Information
                  </h3>
                  <div className="space-y-3">
                    <Label htmlFor="additionalInfo" className="text-gray-700 font-medium">Additional Details (Optional)</Label>
                    <Textarea
                      id="additionalInfo"
                      value={additionalInfo}
                      onChange={(e) => setAdditionalInfo(e.target.value)}
                      placeholder="Add any additional information that might help with your application..."
                      rows={4}
                      className="bg-gray-50 border-gray-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    />
                  </div>
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold py-3 px-6 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 text-lg"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    "Submit Application"
                  )}
                </Button>
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