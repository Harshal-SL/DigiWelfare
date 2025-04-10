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
    <div className="container mx-auto py-8 px-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <p className="text-gray-600 mt-2">Manage welfare schemes and applications</p>
        </div>
        <Button onClick={() => navigate("/admin/new-scheme")} className="flex items-center gap-2">
          <Plus size={16} />
          Create New Scheme
        </Button>
      </div>

      {/* Dashboard summary cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-yellow-50 border border-yellow-100 p-6 rounded-lg">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-yellow-100 text-yellow-700 mr-4">
              <AlertCircle size={24} />
            </div>
            <div>
              <p className="text-sm text-yellow-700 font-medium">Pending Review</p>
              <h3 className="text-2xl font-bold">{pendingApplications.length}</h3>
            </div>
          </div>
        </div>
        
        <div className="bg-green-50 border border-green-100 p-6 rounded-lg">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100 text-green-700 mr-4">
              <CheckCircle size={24} />
            </div>
            <div>
              <p className="text-sm text-green-700 font-medium">Approved</p>
              <h3 className="text-2xl font-bold">{approvedApplications.length}</h3>
            </div>
          </div>
        </div>
        
        <div className="bg-red-50 border border-red-100 p-6 rounded-lg">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-red-100 text-red-700 mr-4">
              <XCircle size={24} />
            </div>
            <div>
              <p className="text-sm text-red-700 font-medium">Rejected</p>
              <h3 className="text-2xl font-bold">{rejectedApplications.length}</h3>
            </div>
          </div>
        </div>
      </div>

      {/* Applications Management */}
      <div className="bg-white rounded-lg shadow mb-8">
        <div className="p-6 border-b">
          <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
            <div>
              <h2 className="text-xl font-semibold">Applications Management</h2>
              <p className="text-gray-600 mt-1">Review and process applications for welfare schemes</p>
            </div>
            <div className="flex gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <Input 
                  placeholder="Search applications..."
                  className="pl-10 w-full md:w-64"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Button 
                variant="outline" 
                size="icon"
                onClick={() => {
                  setLocalApplications([...applications]);
                  toast.success("Applications refreshed");
                }}
              >
                <RefreshCw size={18} />
              </Button>
            </div>
          </div>
        </div>
        
        <Tabs defaultValue="pending" className="w-full">
          <div className="px-6 pt-4">
            <TabsList>
              <TabsTrigger value="pending">
                Pending Review ({pendingApplications.length})
              </TabsTrigger>
              <TabsTrigger value="approved">
                Approved ({approvedApplications.length})
              </TabsTrigger>
              <TabsTrigger value="rejected">
                Rejected ({rejectedApplications.length})
              </TabsTrigger>
              <TabsTrigger value="all">
                All Applications ({localApplications.length})
              </TabsTrigger>
            </TabsList>
          </div>
          
          <TabsContent value="pending" className="p-6">
            {renderApplicationsTable(
              filteredApplications.filter(app => app.status === "pending"),
              handleApprove, 
              handleRejectApplication,
              handleViewApplication
            )}
          </TabsContent>
          
          <TabsContent value="approved" className="p-6">
            {renderApplicationsTable(
              filteredApplications.filter(app => app.status === "approved"),
              handleApprove, 
              handleRejectApplication,
              handleViewApplication
            )}
          </TabsContent>
          
          <TabsContent value="rejected" className="p-6">
            {renderApplicationsTable(
              filteredApplications.filter(app => app.status === "rejected"),
              handleApprove, 
              handleRejectApplication,
              handleViewApplication
            )}
          </TabsContent>
          
          <TabsContent value="all" className="p-6">
            {renderApplicationsTable(filteredApplications, handleApprove, handleRejectApplication, handleViewApplication)}
          </TabsContent>
        </Tabs>
      </div>

      {/* Schemes Management */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b">
          <h2 className="text-xl font-semibold">Schemes Management</h2>
          <p className="text-gray-600 mt-1">Manage existing welfare schemes and create new ones</p>
        </div>
        
        <div className="p-6">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Scheme Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Applications
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Timeline
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {schemes.map((scheme) => {
                  const schemeApplications = localApplications.filter(app => app.schemeId === scheme.id);
                  return (
                    <tr key={scheme.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            <img 
                              className="h-10 w-10 rounded-md object-cover" 
                              src={scheme.thumbnail} 
                              alt={scheme.title} 
                            />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{scheme.title}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                          ${scheme.status === 'active' ? 'bg-green-100 text-green-800' : 
                            scheme.status === 'upcoming' ? 'bg-blue-100 text-blue-800' : 
                            'bg-gray-100 text-gray-800'}`}
                        >
                          {scheme.status.charAt(0).toUpperCase() + scheme.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{schemeApplications.length} Total</div>
                        <div className="text-xs text-gray-500">
                          {schemeApplications.filter(a => a.status === "approved").length} Approved,{" "}
                          {schemeApplications.filter(a => a.status === "pending").length} Pending
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div>
                          Start: {new Date(scheme.startDate).toLocaleDateString()}
                        </div>
                        <div>
                          End: {new Date(scheme.endDate).toLocaleDateString()}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <Button 
                          variant="ghost"
                          size="sm"
                          onClick={() => navigate(`/admin/schemes/${scheme.id}`)}
                        >
                          Edit
                        </Button>
                        <Button 
                          variant="ghost"
                          size="sm"
                          onClick={() => navigate(`/schemes/${scheme.id}`)}
                        >
                          View
                        </Button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

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

// Helper function to render applications table
const renderApplicationsTable = (
  applications: Application[], 
  handleApprove: (id: string) => void, 
  handleReject: (application: Application) => void,
  handleView: (application: Application) => void
) => {
  if (applications.length === 0) {
    return (
      <div className="text-center py-8">
        <FileText className="mx-auto h-12 w-12 text-gray-400 mb-3" />
        <h3 className="text-lg font-medium text-gray-900 mb-1">No Applications Found</h3>
        <p className="text-gray-600">There are no applications matching your criteria.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Applicant
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Scheme
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Submitted
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Status
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              AI Score
            </th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {applications.map((application) => {
            const scheme = schemes.find(s => s.id === application.schemeId);
            return (
              <tr key={application.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{application.userName}</div>
                  <div className="text-sm text-gray-500">ID: {application.userId}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{scheme?.title || "Unknown Scheme"}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(application.submittedAt).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                    ${application.status === 'approved' ? 'bg-green-100 text-green-800' : 
                      application.status === 'rejected' ? 'bg-red-100 text-red-800' : 
                      'bg-yellow-100 text-yellow-800'}`}
                  >
                    {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className={`text-sm font-medium 
                    ${(application.eligibilityScore || 0) >= 70 ? 'text-green-600' : 
                      (application.eligibilityScore || 0) >= 50 ? 'text-yellow-600' : 
                      'text-red-600'}`}
                  >
                    {application.eligibilityScore || 0}%
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex justify-end space-x-2">
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => handleView(application)}
                    >
                      View
                    </Button>
                    {application.status === "pending" && (
                      <>
                        <Button 
                          variant="outline" 
                          size="sm"
                          className="text-green-600 border-green-600 hover:bg-green-50"
                          onClick={() => handleApprove(application.id)}
                        >
                          Approve
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          className="text-red-600 border-red-600 hover:bg-red-50"
                          onClick={() => handleReject(application)}
                        >
                          Reject
                        </Button>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default AdminDashboard;
