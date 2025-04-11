import { useEffect } from "react";
import { Button } from "../components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { 
  CheckCircle2, 
  Clock, 
  ExternalLink, 
  FileText, 
  XCircle,
  AlertCircle
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { schemes, applications } from "@/data/mockData";
import { Alert, AlertDescription, AlertTitle } from "../components/ui/alert";
import { Badge } from "../components/ui/badge";
import { Label } from "../components/ui/label";

const UserDashboard = () => {
  const { user, isLoggedIn } = useAuth();
  const navigate = useNavigate();

  // Check if user is logged in, if not redirect to login
  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/login");
    }
  }, [isLoggedIn, navigate]);

  // Filter applications for the current user
  const userApplications = applications.filter(app => app.userId === user?.id);
  
  // Group applications by status
  const pendingApplications = userApplications.filter(app => app.status === "pending");
  const approvedApplications = userApplications.filter(app => app.status === "approved");
  const rejectedApplications = userApplications.filter(app => app.status === "rejected");

  // Find schemes that the user hasn't applied for
  const appliedSchemeIds = userApplications.map(app => app.schemeId);
  const availableSchemes = schemes.filter(
    scheme => !appliedSchemeIds.includes(scheme.id) && scheme.status === "active"
  );

  const renderApplicationStatus = (application: Application) => {
    const scheme = schemes.find(s => s.id === application.schemeId);
    if (!scheme) return null;

    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold">{scheme.title}</h3>
            <p className="text-sm text-gray-500">
              Applied on {new Date(application.submittedAt).toLocaleDateString()}
            </p>
          </div>
          <Badge
            variant={
              application.status === "approved"
                ? "success"
                : application.status === "rejected"
                ? "destructive"
                : "secondary"
            }
          >
            {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
          </Badge>
        </div>

        {application.status === "rejected" && application.adminComment && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Rejection Reason</AlertTitle>
            <AlertDescription>
              {application.adminComment}
            </AlertDescription>
          </Alert>
        )}

        <div className="text-sm text-gray-600">
          <p>Required Documents: {application.documents.join(", ")}</p>
        </div>

        {application.status === "rejected" && (
          <div className="mt-4">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => navigate(`/schemes/${application.schemeId}/apply`)}
            >
              Reapply for this Scheme
            </Button>
          </div>
        )}
      </div>
    );
  };

  if (!isLoggedIn) {
    return null; // Will redirect to login
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8 bg-[#0f698a] p-6 rounded-lg">
        <h1 className="text-3xl font-bold text-white">Hello, {user?.name}</h1>
        <p className="text-white mt-2">Welcome to your DigiWelfare dashboard.</p>
      </div>

      {/* Dashboard summary cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-welfare-50 border border-welfare-100 p-6 rounded-lg">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-welfare-100 text-welfare-700 mr-4">
              <Clock size={24} />
            </div>
            <div>
              <p className="text-sm text-welfare-700 font-medium">Pending Applications</p>
              <h3 className="text-2xl font-bold">{pendingApplications.length}</h3>
            </div>
          </div>
        </div>
        
        <div className="bg-green-50 border border-green-100 p-6 rounded-lg">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100 text-green-700 mr-4">
              <CheckCircle2 size={24} />
            </div>
            <div>
              <p className="text-sm text-green-700 font-medium">Approved Applications</p>
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
              <p className="text-sm text-red-700 font-medium">Rejected Applications</p>
              <h3 className="text-2xl font-bold">{rejectedApplications.length}</h3>
            </div>
          </div>
        </div>
      </div>

      {/* Main dashboard content */}
      <Tabs defaultValue="schemes" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="schemes">Available Schemes</TabsTrigger>
          <TabsTrigger value="applications">My Applications</TabsTrigger>
        </TabsList>
        
        <TabsContent value="schemes">
          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b bg-[#0f698a] text-white">
              <h2 className="text-xl font-semibold">Schemes Available for Application</h2>
              <p className="text-white mt-1">These are the welfare schemes you are eligible to apply for.</p>
            </div>
            
            <div className="p-6">
              {availableSchemes.length > 0 ? (
                <div className="grid md:grid-cols-2 gap-6">
                  {availableSchemes.map((scheme) => (
                    <div key={scheme.id} className="scheme-card">
                      <div className="flex flex-col sm:flex-row gap-4">
                        <div className="sm:w-24 h-24 rounded-md overflow-hidden">
                          <img 
                            src={scheme.thumbnail} 
                            alt={scheme.title} 
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold mb-1">{scheme.title}</h3>
                          <p className="text-sm text-gray-600 mb-3">{scheme.description}</p>
                          <div className="flex gap-2">
                            <Button 
                              onClick={() => navigate(`/schemes/${scheme.id}`)}
                              size="sm"
                            >
                              Apply Now
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => navigate(`/schemes/${scheme.id}`)}
                            >
                              View Details
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <FileText className="mx-auto h-12 w-12 text-gray-400 mb-3" />
                  <h3 className="text-lg font-medium text-gray-900 mb-1">No Available Schemes</h3>
                  <p className="text-gray-600 mb-4">You have already applied for all available schemes.</p>
                  <Button onClick={() => navigate("/schemes")}>
                    View All Schemes
                  </Button>
                </div>
              )}
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="applications">
          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b bg-[#0f698a] text-white">
              <h2 className="text-xl font-semibold">My Applications</h2>
              <p className="text-white mt-1">Track the status of your scheme applications.</p>
            </div>
            
            <div className="p-6">
              {userApplications.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Scheme
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Submitted On
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Transaction
                        </th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {userApplications.map((application) => {
                        return (
                          <tr key={application.id}>
                            <td className="px-6 py-4 whitespace-nowrap">
                              {renderApplicationStatus(application)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {application.transactionHash ? (
                                <a 
                                  href="#" 
                                  className="text-welfare-600 hover:text-welfare-500 flex items-center"
                                  onClick={(e) => {
                                    e.preventDefault();
                                    alert(`Blockchain Transaction: ${application.transactionHash}`);
                                  }}
                                >
                                  View
                                  <ExternalLink size={14} className="ml-1" />
                                </a>
                              ) : (
                                "Not available"
                              )}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                              <Button 
                                variant="ghost" 
                                size="sm"
                                onClick={() => navigate(`/applications/${application.id}`)}
                              >
                                View Details
                              </Button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-8">
                  <FileText className="mx-auto h-12 w-12 text-gray-400 mb-3" />
                  <h3 className="text-lg font-medium text-gray-900 mb-1">No Applications Yet</h3>
                  <p className="text-gray-600 mb-4">You haven't applied for any schemes yet.</p>
                  <Button onClick={() => navigate("/schemes")}>
                    Browse Schemes
                  </Button>
                </div>
              )}
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default UserDashboard;
