import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  AlertCircle, 
  CheckCircle, 
  FileText, 
  Plus, 
  RefreshCw, 
  Search, 
  XCircle 
} from "lucide-react";
import { schemes, applications, Application } from "@/data/mockData";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { AdminApplicantsList } from "@/components/AdminApplicantsList";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const AdminDashboard = () => {
  const { user, isLoggedIn } = useAuth();
  const navigate = useNavigate();
  const [localApplications, setLocalApplications] = useState<Application[]>(applications);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedApplication, setSelectedApplication] = useState<Application | null>(null);
  const [rejectionComment, setRejectionComment] = useState("");
  const [isRejectDialogOpen, setIsRejectDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);

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
    }, 5000); // Refresh every 5 seconds

    return () => clearInterval(interval);
  }, []);

  const pendingApplications = localApplications.filter(app => app.status === "pending");
  const approvedApplications = localApplications.filter(app => app.status === "approved");
  const rejectedApplications = localApplications.filter(app => app.status === "rejected");

  const handleApprove = (applicationId: string) => {
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
    toast.success("Application approved successfully");
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
      
      const index = localApplications.findIndex(app => app.id === selectedApplication.id);
      if (index !== -1) {
        localApplications[index] = {
          ...localApplications[index],
          status: "rejected",
          adminComment: rejectionComment
        };
      }
      
      toast.success("Application rejected successfully!");
      setIsRejectDialogOpen(false);
      setRejectionComment("");
      setSelectedApplication(null);
    } catch (error) {
      console.error("Error rejecting application:", error);
      toast.error("Failed to reject application. Please try again.");
    }
  };

  const handleViewApplication = (application: Application) => {
    setSelectedApplication(application);
    setIsViewDialogOpen(true);
  };

  const filteredApplications = localApplications.filter(app => {
    if (!searchTerm) return true;
    
    const scheme = schemes.find(s => s.id === app.schemeId);
    return (
      app.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (scheme?.title || "").toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  if (!isLoggedIn || user?.role !== "admin") {
    return null; // Will redirect
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>

      <Tabs defaultValue="applicants" className="space-y-4">
        <TabsList>
          <TabsTrigger value="applicants">Applicants</TabsTrigger>
          <TabsTrigger value="schemes">Schemes</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="applicants">
          <Card>
            <CardHeader>
              <CardTitle>Applications Management</CardTitle>
              <CardDescription>
                View and manage applications across all schemes
              </CardDescription>
            </CardHeader>
            <CardContent>
              <AdminApplicantsList />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="schemes">
          <Card>
            <CardHeader>
              <CardTitle>Schemes Management</CardTitle>
              <CardDescription>
                Manage welfare schemes and their configurations
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* Add SchemeManagement component here */}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics">
          <Card>
            <CardHeader>
              <CardTitle>Analytics Dashboard</CardTitle>
              <CardDescription>
                View application statistics and insights
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* Add Analytics component here */}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

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
                    {schemes.find(s => s.id === selectedApplication.schemeId)?.title || "Unknown Scheme"}
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
