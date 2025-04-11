import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { Loader2, CheckCircle2, XCircle, Clock, FileText, IndianRupee } from "lucide-react";
import { format } from "date-fns";
import { applications } from "../data/mockData";
import { useAuth } from "../contexts/AuthContext";

interface Application {
  id: string;
  schemeId: string;
  schemeName: string;
  status: 'pending' | 'approved' | 'rejected' | 'payment_pending' | 'completed';
  submittedAt: string;
  documents: { name: string; url: string; }[];
  eligibilityScore?: number;
  reviewedBy?: string;
  reviewedAt?: string;
  rejectionReason?: string;
  transactionHash?: string;
}

const statusConfig = {
  pending: {
    label: "Pending Review",
    color: "bg-yellow-100 text-yellow-800",
    icon: Clock,
  },
  approved: {
    label: "Approved",
    color: "bg-green-100 text-green-800",
    icon: CheckCircle2,
  },
  rejected: {
    label: "Rejected",
    color: "bg-red-100 text-red-800",
    icon: XCircle,
  },
  payment_pending: {
    label: "Payment Pending",
    color: "bg-[#0f698a]/10 text-[#0f698a]",
    icon: IndianRupee,
  },
  completed: {
    label: "Completed",
    color: "bg-purple-100 text-purple-800",
    icon: CheckCircle2,
  },
};

const ApplicationDetailsPage = () => {
  const { applicationId } = useParams<{ applicationId: string }>();
  const navigate = useNavigate();
  const { user, isLoggedIn } = useAuth();
  const [application, setApplication] = useState<Application | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/login');
      return;
    }

    const fetchApplication = async () => {
      try {
        // In a real application, this would be an API call
        const foundApplication = applications.find(app => app.id === applicationId);
        
        if (!foundApplication) {
          throw new Error('Application not found');
        }

        // Check if the user has access to this application
        if (foundApplication.userId !== user?.id && user?.role !== 'admin') {
          throw new Error('Unauthorized');
        }

        setApplication(foundApplication as Application);
      } catch (error) {
        console.error('Error fetching application:', error);
        navigate('/dashboard');
      } finally {
        setIsLoading(false);
      }
    };

    fetchApplication();
  }, [applicationId, isLoggedIn, navigate, user]);

  const getStatusBadge = (status: Application['status']) => {
    const config = statusConfig[status];
    const Icon = config.icon;
    return (
      <Badge className={`${config.color} flex items-center gap-1`}>
        <Icon className="h-3 w-3" />
        {config.label}
      </Badge>
    );
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
      </div>
    );
  }

  if (!application) {
    return null;
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <Button
        variant="ghost"
        className="mb-6"
        onClick={() => navigate('/dashboard')}
      >
        ← Back to Dashboard
      </Button>

      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-2xl font-bold">
              Application Details
            </CardTitle>
            {getStatusBadge(application.status)}
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold mb-2">Scheme Information</h3>
              <p className="text-gray-600">{application.schemeName}</p>
              <p className="text-sm text-gray-500 mt-1">
                Submitted on {format(new Date(application.submittedAt), 'PPP')}
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Application ID</h3>
              <p className="text-gray-600 font-mono">{application.id}</p>
            </div>
          </div>

          {/* Documents */}
          <div>
            <h3 className="font-semibold mb-3">Submitted Documents</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {application.documents.map((doc, index) => (
                <div
                  key={index}
                  className="flex items-center gap-2 p-3 border rounded-lg"
                >
                  <FileText className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="font-medium">{doc.name}</p>
                    <a
                      href={doc.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-blue-600 hover:underline"
                    >
                      View Document
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Review Information */}
          {application.reviewedBy && (
            <div>
              <h3 className="font-semibold mb-2">Review Information</h3>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-gray-600">
                  Reviewed by: {application.reviewedBy}
                </p>
                {application.reviewedAt && (
                  <p className="text-sm text-gray-500 mt-1">
                    Reviewed on: {format(new Date(application.reviewedAt), 'PPP')}
                  </p>
                )}
                {application.rejectionReason && (
                  <div className="mt-2 text-red-600">
                    <p className="font-medium">Reason for Rejection:</p>
                    <p className="text-sm mt-1">{application.rejectionReason}</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Blockchain Information */}
          {application.transactionHash && (
            <div>
              <h3 className="font-semibold mb-2">Blockchain Record</h3>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm font-mono text-gray-600">
                  Transaction Hash: {application.transactionHash}
                </p>
              </div>
            </div>
          )}

          {/* Eligibility Score */}
          {application.eligibilityScore !== undefined && (
            <div>
              <h3 className="font-semibold mb-2">Eligibility Score</h3>
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center gap-2">
                  <div
                    className={`text-2xl font-bold ${
                      application.eligibilityScore >= 70
                        ? 'text-green-600'
                        : application.eligibilityScore >= 50
                        ? 'text-yellow-600'
                        : 'text-red-600'
                    }`}
                  >
                    {application.eligibilityScore}%
                  </div>
                  <Badge
                    className={
                      application.eligibilityScore >= 70
                        ? 'bg-green-100 text-green-800'
                        : application.eligibilityScore >= 50
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-red-100 text-red-800'
                    }
                  >
                    {application.eligibilityScore >= 70
                      ? 'High'
                      : application.eligibilityScore >= 50
                      ? 'Medium'
                      : 'Low'}
                  </Badge>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ApplicationDetailsPage; 