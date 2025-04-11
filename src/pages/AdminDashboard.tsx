import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { Button } from "../components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { 
  AlertCircle, 
  CheckCircle, 
  FileText, 
  Plus, 
  RefreshCw, 
  Search, 
  XCircle,
  MessageSquare
} from "lucide-react";
import { schemes, applications, Application, Scheme } from "../data/mockData";
import { toast } from "sonner";
import { Input } from "../components/ui/input";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "../components/ui/dialog";
import { Textarea } from "../components/ui/textarea";
import { Badge } from "../components/ui/badge";
import { AdminApplicantsList } from "../components/AdminApplicantsList";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { CreateSchemeForm } from "../components/CreateSchemeForm";
import { logToBlockchain } from '../utils/blockchainLogger';
import chatBotLogo from '../assets/chat-bot.svg';

// Add custom toast styles
const customToast = {
  style: {
    color: '#0f698a',
  },
};

const AdminDashboard = () => {
  const { user, isLoggedIn } = useAuth();
  const navigate = useNavigate();
  const [localApplications, setLocalApplications] = useState<Application[]>(applications);
  const [localSchemes, setLocalSchemes] = useState<Scheme[]>(schemes);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedApplication, setSelectedApplication] = useState<Application | null>(null);
  const [rejectionComment, setRejectionComment] = useState("");
  const [isRejectDialogOpen, setIsRejectDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [selectedTab, setSelectedTab] = useState("applicants");
  const [showCreateScheme, setShowCreateScheme] = useState(false);
  const [showApplicationDetails, setShowApplicationDetails] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  // Check if user is logged in and is an admin, if not redirect
  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/login");
      return;
    }
    
    if (user?.role !== "admin") {
      navigate("/dashboard");
      toast.error("You don't have permission to access admin dashboard");
    }
  }, [isLoggedIn, user, navigate]);

  // Refresh applications list periodically
  useEffect(() => {
    const interval = setInterval(() => {
      setLocalApplications([...applications]);
      setLocalSchemes([...schemes]);
    }, 5000); // Refresh every 5 seconds

    return () => clearInterval(interval);
  }, []);

  const pendingApplications = localApplications.filter(app => app.status === "pending");
  const approvedApplications = localApplications.filter(app => app.status === "approved");
  const rejectedApplications = localApplications.filter(app => app.status === "rejected");

  const handleApprove = async (applicationId: string) => {
    setIsProcessing(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Log to blockchain
      await logToBlockchain({
        applicantId: selectedApplication?.userId,
        schemeId: selectedApplication?.schemeId,
        amount: 0, // Amount will be set during payment
        metadata: {
          applicantName: selectedApplication?.userName,
          schemeName: localSchemes.find(s => s.id === selectedApplication?.schemeId)?.title || "Unknown Scheme",
          eligibilityScore: selectedApplication?.eligibilityScore
        }
      });

      setLocalApplications(prev => 
        prev.map(app => 
          app.id === applicationId 
            ? {
                ...app, 
                status: "approved", 
                reviewedBy: user?.name || "Admin", 
                reviewedAt: new Date().toISOString(),
                transactionHash: `0x${Math.random().toString(16).substr(2, 8)}...${Math.random().toString(16).substr(2, 4)}`
              } 
            : app
        )
      );
      
      toast.success("Application approved successfully", customToast);
      setShowApplicationDetails(false);
    } catch (error) {
      console.error("Error approving application:", error);
      toast.error("Failed to approve application", customToast);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleRejectApplication = async (application: Application) => {
    setSelectedApplication(application);
    setIsRejectDialogOpen(true);
  };

  const handleConfirmReject = async () => {
    if (!selectedApplication) return;

    try {
      // Simulate API call to reject application
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setLocalApplications(prev => 
        prev.map(app => 
          app.id === selectedApplication.id
            ? {
                ...app,
                status: "rejected",
                adminComment: rejectionComment,
                reviewedBy: user?.name || "Admin",
                reviewedAt: new Date().toISOString()
              }
            : app
        )
      );
      
      toast.success("Application rejected successfully!", customToast);
      setIsRejectDialogOpen(false);
      setRejectionComment("");
      setSelectedApplication(null);
    } catch (error) {
      console.error("Error rejecting application:", error);
      toast.error("Failed to reject application. Please try again.", customToast);
    }
  };

  const handleViewApplication = (application: Application) => {
    setSelectedApplication(application);
    setIsViewDialogOpen(true);
  };

  const filteredApplications = localApplications.filter(app => {
    if (!searchTerm) return true;
    
    const scheme = localSchemes.find(s => s.id === app.schemeId);
    return (
      app.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (scheme?.title || "").toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  const handleCreateScheme = async (data: any) => {
    try {
      // In a real implementation, this would make an API call to create the scheme
      const newScheme: Scheme = {
        id: `scheme-${localSchemes.length + 1}`,
        title: data.title,
        description: data.description,
        eligibility: data.eligibilityCriteria.split(',').map((item: string) => item.trim()),
        benefits: "To be determined",
        documents: data.documentsRequired.split(',').map((item: string) => item.trim()),
        thumbnail: "https://images.unsplash.com/photo-1579684385127-1ef15d508118?q=80&w=500&auto=format&fit=crop",
        status: "active",
        startDate: data.startDate,
        endDate: data.endDate
      };

      setLocalSchemes(prev => [...prev, newScheme]);
      toast.success("Scheme created successfully!", customToast);
    } catch (error) {
      console.error("Error creating scheme:", error);
      toast.error("Failed to create scheme. Please try again.", customToast);
    }
  };

  if (!isLoggedIn || user?.role !== "admin") {
    return null; // Will redirect
  }

  return (
    <div className="container mx-auto p-4 space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <img src={chatBotLogo} alt="Welfare Logo" className="h-8 w-8" />
          <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        </div>
        <Button onClick={() => setShowCreateScheme(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add New Scheme
        </Button>
      </div>

      <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-4">
        <TabsList>
          <TabsTrigger 
            value="applicants"
            className="data-[state=active]:bg-[#0f698a] data-[state=active]:text-white bg-white text-[#0f698a] border border-[#0f698a]"
          >
            Applicants
          </TabsTrigger>
          <TabsTrigger 
            value="schemes"
            className="data-[state=active]:bg-[#0f698a] data-[state=active]:text-white bg-white text-[#0f698a] border border-[#0f698a]"
          >
            Schemes
          </TabsTrigger>
        </TabsList>

        <TabsContent value="applicants">
          <AdminApplicantsList />
        </TabsContent>

        <TabsContent value="schemes">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {localSchemes.map((scheme) => (
              <Card key={scheme.id}>
                <CardHeader>
                  <CardTitle>{scheme.title}</CardTitle>
                  <CardDescription>
                    Status: {scheme.status}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 mb-4">
                    {scheme.description}
                  </p>
                  <div className="space-y-2">
                    <h4 className="font-semibold">Eligibility Criteria:</h4>
                    <ul className="list-disc list-inside text-sm text-gray-600">
                      {scheme.eligibility.map((criteria, index) => (
                        <li key={index}>{criteria}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="mt-4">
                    <h4 className="font-semibold">Required Documents:</h4>
                    <ul className="list-disc list-inside text-sm text-gray-600">
                      {scheme.documents.map((doc, index) => (
                        <li key={index}>{doc}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="mt-4">
                    <h4 className="font-semibold">Benefits:</h4>
                    <p className="text-sm text-gray-600">{scheme.benefits}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Create Scheme Dialog */}
      {showCreateScheme && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Create New Scheme</h2>
              <Button variant="ghost" onClick={() => setShowCreateScheme(false)}>
                ×
              </Button>
            </div>
            <CreateSchemeForm onSubmit={handleCreateScheme} />
          </div>
        </div>
      )}

      {/* Application Details Dialog */}
      {showApplicationDetails && selectedApplication && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Application Details</h2>
              <Button variant="ghost" onClick={() => setShowApplicationDetails(false)}>
                ×
              </Button>
            </div>

            <div className="space-y-6">
              {/* Application Status */}
              <div className="space-y-2">
                <h3 className="font-semibold">Application Status</h3>
                <Badge
                  className={
                    selectedApplication.status === "approved"
                      ? "bg-green-100 text-green-800"
                      : selectedApplication.status === "rejected"
                      ? "bg-red-100 text-red-800"
                      : "bg-yellow-100 text-yellow-800"
                  }
                >
                  {selectedApplication.status.charAt(0).toUpperCase() + selectedApplication.status.slice(1)}
                </Badge>
              </div>

              {/* Applicant Information */}
              <div className="space-y-2">
                <h3 className="font-semibold">Applicant Information</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Name</p>
                    <p className="font-medium">{selectedApplication.userName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">User ID</p>
                    <p className="font-medium">{selectedApplication.userId}</p>
                  </div>
                </div>
              </div>

              {/* Scheme Information */}
              <div className="space-y-2">
                <h3 className="font-semibold">Scheme Information</h3>
                <div>
                  <p className="text-sm text-gray-500">Scheme Name</p>
                  <p className="font-medium">
                    {localSchemes.find(s => s.id === selectedApplication.schemeId)?.title || "Unknown Scheme"}
                  </p>
                </div>
              </div>

              {/* Submitted Documents */}
              <div className="space-y-2">
                <h3 className="font-semibold">Submitted Documents</h3>
                <div className="grid grid-cols-2 gap-2">
                  {selectedApplication.documents.map((doc, index) => (
                    <div key={index} className="flex items-center space-x-2 p-2 bg-gray-50 rounded">
                      <FileText className="h-4 w-4 text-gray-500" />
                      <span className="text-sm">{doc.name}</span>
                      <a 
                        href={doc.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800 text-sm"
                      >
                        View
                      </a>
                    </div>
                  ))}
                </div>
              </div>

              {/* Eligibility Score */}
              <div className="space-y-2">
                <h3 className="font-semibold">Eligibility Score</h3>
                <div className={`text-lg font-medium 
                  ${(selectedApplication.eligibilityScore || 0) >= 70 ? 'text-green-600' : 
                    (selectedApplication.eligibilityScore || 0) >= 50 ? 'text-yellow-600' : 
                    'text-red-600'}`}
                >
                  {selectedApplication.eligibilityScore || 0}%
                </div>
              </div>

              {/* Additional Information */}
              {selectedApplication.additionalInfo && (
                <div className="space-y-2">
                  <h3 className="font-semibold">Additional Information</h3>
                  <p className="text-sm text-gray-600">{selectedApplication.additionalInfo}</p>
                </div>
              )}

              {/* Rejection Reason */}
              {selectedApplication.status === "rejected" && selectedApplication.adminComment && (
                <div className="space-y-2">
                  <h3 className="font-semibold">Rejection Reason</h3>
                  <p className="text-sm text-red-600">{selectedApplication.adminComment}</p>
                </div>
              )}

              {/* Application Timeline */}
              <div className="space-y-2">
                <h3 className="font-semibold">Application Timeline</h3>
                <div className="space-y-1">
                  <p className="text-sm text-gray-600">
                    Submitted on {new Date(selectedApplication.submittedAt).toLocaleDateString()}
                  </p>
                  {selectedApplication.reviewedAt && (
                    <p className="text-sm text-gray-600">
                      Reviewed on {new Date(selectedApplication.reviewedAt).toLocaleDateString()}
                    </p>
                  )}
                  {selectedApplication.reviewedBy && (
                    <p className="text-sm text-gray-600">
                      Reviewed by {selectedApplication.reviewedBy}
                    </p>
                  )}
                </div>
              </div>

              {/* Transaction Information */}
              {selectedApplication.transactionHash && (
                <div className="space-y-2">
                  <h3 className="font-semibold">Transaction Information</h3>
                  <p className="text-sm text-gray-600">
                    Transaction Hash: {selectedApplication.transactionHash}
                  </p>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex justify-end space-x-4 pt-4">
                <Button
                  variant="outline"
                  onClick={() => setShowApplicationDetails(false)}
                  disabled={isProcessing}
                >
                  Cancel
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => handleRejectApplication(selectedApplication)}
                  disabled={isProcessing}
                >
                  {isProcessing ? (
                    <div className="flex items-center">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                      Processing...
                    </div>
                  ) : (
                    <>
                      <XCircle className="mr-2 h-4 w-4" />
                      Reject
                    </>
                  )}
                </Button>
                <Button
                  onClick={() => handleApprove(selectedApplication.id)}
                  disabled={isProcessing}
                >
                  {isProcessing ? (
                    <div className="flex items-center">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                      Processing...
                    </div>
                  ) : (
                    <>
                      <CheckCircle className="mr-2 h-4 w-4" />
                      Approve
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Reject Application Dialog */}
      <Dialog open={isRejectDialogOpen} onOpenChange={setIsRejectDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject Application</DialogTitle>
            <DialogDescription>
              Please provide a reason for rejecting this application.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <Textarea
              value={rejectionComment}
              onChange={(e) => setRejectionComment(e.target.value)}
              placeholder="Enter rejection reason..."
              className="min-h-[100px]"
              required
            />
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsRejectDialogOpen(false);
                setRejectionComment("");
                setSelectedApplication(null);
              }}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleConfirmReject}
              disabled={!rejectionComment.trim()}
            >
              Reject Application
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Application Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Application Details</DialogTitle>
            <DialogDescription>
              View the complete application information.
            </DialogDescription>
          </DialogHeader>
          {selectedApplication && (
            <div className="space-y-6">
              {/* Application Status */}
              <div className="space-y-2">
                <h3 className="font-semibold">Application Status</h3>
                <Badge
                  className={
                    selectedApplication.status === "approved"
                      ? "bg-green-100 text-green-800"
                      : selectedApplication.status === "rejected"
                      ? "bg-red-100 text-red-800"
                      : "bg-yellow-100 text-yellow-800"
                  }
                >
                  {selectedApplication.status.charAt(0).toUpperCase() + selectedApplication.status.slice(1)}
                </Badge>
              </div>

              {/* Applicant Information */}
              <div className="space-y-2">
                <h3 className="font-semibold">Applicant Information</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Name</p>
                    <p className="font-medium">{selectedApplication.userName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">User ID</p>
                    <p className="font-medium">{selectedApplication.userId}</p>
                  </div>
                </div>
              </div>

              {/* Scheme Information */}
              <div className="space-y-2">
                <h3 className="font-semibold">Scheme Information</h3>
                <div>
                  <p className="text-sm text-gray-500">Scheme Name</p>
                  <p className="font-medium">
                    {localSchemes.find(s => s.id === selectedApplication.schemeId)?.title || "Unknown Scheme"}
                  </p>
                </div>
              </div>

              {/* Submitted Documents */}
              <div className="space-y-2">
                <h3 className="font-semibold">Submitted Documents</h3>
                <div className="grid grid-cols-2 gap-2">
                  {selectedApplication.documents.map((doc, index) => (
                    <div key={index} className="flex items-center space-x-2 p-2 bg-gray-50 rounded">
                      <FileText className="h-4 w-4 text-gray-500" />
                      <span className="text-sm">{doc.name}</span>
                      <a 
                        href={doc.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800 text-sm"
                      >
                        View
                      </a>
                    </div>
                  ))}
                </div>
              </div>

              {/* Eligibility Score */}
              <div className="space-y-2">
                <h3 className="font-semibold">Eligibility Score</h3>
                <div className={`text-lg font-medium 
                  ${(selectedApplication.eligibilityScore || 0) >= 70 ? 'text-green-600' : 
                    (selectedApplication.eligibilityScore || 0) >= 50 ? 'text-yellow-600' : 
                    'text-red-600'}`}
                >
                  {selectedApplication.eligibilityScore || 0}%
                </div>
              </div>

              {/* Additional Information */}
              {selectedApplication.additionalInfo && (
                <div className="space-y-2">
                  <h3 className="font-semibold">Additional Information</h3>
                  <p className="text-sm text-gray-600">{selectedApplication.additionalInfo}</p>
                </div>
              )}

              {/* Rejection Reason */}
              {selectedApplication.status === "rejected" && selectedApplication.adminComment && (
                <div className="space-y-2">
                  <h3 className="font-semibold">Rejection Reason</h3>
                  <p className="text-sm text-red-600">{selectedApplication.adminComment}</p>
                </div>
              )}

              {/* Application Timeline */}
              <div className="space-y-2">
                <h3 className="font-semibold">Application Timeline</h3>
                <div className="space-y-1">
                  <p className="text-sm text-gray-600">
                    Submitted on {new Date(selectedApplication.submittedAt).toLocaleDateString()}
                  </p>
                  {selectedApplication.reviewedAt && (
                    <p className="text-sm text-gray-600">
                      Reviewed on {new Date(selectedApplication.reviewedAt).toLocaleDateString()}
                    </p>
                  )}
                  {selectedApplication.reviewedBy && (
                    <p className="text-sm text-gray-600">
                      Reviewed by {selectedApplication.reviewedBy}
                    </p>
                  )}
                </div>
              </div>

              {/* Transaction Information */}
              {selectedApplication.transactionHash && (
                <div className="space-y-2">
                  <h3 className="font-semibold">Transaction Information</h3>
                  <p className="text-sm text-gray-600">
                    Transaction Hash: {selectedApplication.transactionHash}
                  </p>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminDashboard;
