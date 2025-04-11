import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../components/ui/dialog";
import { Loader2, CheckCircle2, XCircle, Clock, FileText, IndianRupee } from "lucide-react";
import { format } from "date-fns";

interface Application {
  id: string;
  schemeId: string;
  schemeName: string;
  status: 'pending' | 'approved' | 'rejected' | 'payment_pending' | 'completed';
  submittedAt: string;
  documents: string[];
  verificationStatus: {
    isVerified: boolean;
    verifiedBy?: string;
    verifiedAt?: string;
    verificationNotes?: string;
  };
  paymentStatus: {
    isInitiated: boolean;
    initiatedAt?: string;
    amount?: number;
    paymentId?: string;
  };
}

interface ApplicationTrackerProps {
  applications: Application[];
  isLoading?: boolean;
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

export const ApplicationTracker = ({ applications, isLoading = false }: ApplicationTrackerProps) => {
  const navigate = useNavigate();
  const [selectedApplication, setSelectedApplication] = useState<Application | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleViewDetails = (application: Application) => {
    setSelectedApplication(application);
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setSelectedApplication(null);
  };

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

  const getVerificationStatus = (application: Application) => {
    if (!application.verificationStatus.isVerified) {
      return (
        <div className="flex items-center gap-2 text-yellow-600">
          <Clock className="h-4 w-4" />
          <span>Pending Verification</span>
        </div>
      );
    }

    return (
      <div className="space-y-2">
        <div className="flex items-center gap-2 text-green-600">
          <CheckCircle2 className="h-4 w-4" />
          <span>Verified by {application.verificationStatus.verifiedBy}</span>
        </div>
        {application.verificationStatus.verificationNotes && (
          <p className="text-sm text-gray-600">
            Notes: {application.verificationStatus.verificationNotes}
          </p>
        )}
        <p className="text-xs text-gray-500">
          Verified on: {format(new Date(application.verificationStatus.verifiedAt!), 'PPP')}
        </p>
      </div>
    );
  };

  const getPaymentStatus = (application: Application) => {
    if (!application.paymentStatus.isInitiated) {
      return (
        <div className="flex items-center gap-2 text-yellow-600">
          <Clock className="h-4 w-4" />
          <span>Payment Not Initiated</span>
        </div>
      );
    }

    return (
      <div className="space-y-2">
        <div className="flex items-center gap-2 text-[#0f698a]">
          <IndianRupee className="h-4 w-4" />
          <span>Payment Initiated</span>
        </div>
        <p className="text-sm">
          Amount: ₹{application.paymentStatus.amount}
        </p>
        <p className="text-xs text-gray-500">
          Initiated on: {format(new Date(application.paymentStatus.initiatedAt!), 'PPP')}
        </p>
        {application.paymentStatus.paymentId && (
          <p className="text-xs text-gray-500">
            Payment ID: {application.paymentStatus.paymentId}
          </p>
        )}
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
      </div>
    );
  }

  if (applications.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center p-8 text-center">
          <FileText className="h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900">No Applications Found</h3>
          <p className="text-sm text-gray-500 mt-2">
            You haven't submitted any applications yet.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {applications.map((application) => (
        <Card key={application.id} className="hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="space-y-1">
                <h3 className="text-lg font-medium">{application.schemeName}</h3>
                <p className="text-sm text-gray-500">
                  Applied on {format(new Date(application.submittedAt), 'PPP')}
                </p>
                <div className="flex flex-wrap gap-2 mt-2">
                  {getStatusBadge(application.status)}
                </div>
              </div>
              <Button
                variant="outline"
                onClick={() => navigate(`/applications/${application.id}`)}
              >
                View Details
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}

      <Dialog open={isDialogOpen} onOpenChange={handleCloseDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Application Details</DialogTitle>
          </DialogHeader>
          {selectedApplication && (
            <div className="space-y-6">
              <div className="space-y-2">
                <h3 className="text-lg font-medium">{selectedApplication.schemeName}</h3>
                <p className="text-sm text-gray-500">
                  Application ID: {selectedApplication.id}
                </p>
                <p className="text-sm text-gray-500">
                  Applied on: {format(new Date(selectedApplication.submittedAt), 'PPP')}
                </p>
                <div className="flex flex-wrap gap-2">
                  {getStatusBadge(selectedApplication.status)}
                </div>
              </div>

              <div className="space-y-4">
                <div className="border rounded-lg p-4">
                  <h4 className="font-medium mb-2">Verification Status</h4>
                  {getVerificationStatus(selectedApplication)}
                </div>

                <div className="border rounded-lg p-4">
                  <h4 className="font-medium mb-2">Payment Status</h4>
                  {getPaymentStatus(selectedApplication)}
                </div>

                <div className="border rounded-lg p-4">
                  <h4 className="font-medium mb-2">Required Documents</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {selectedApplication.documents.map((doc) => (
                      <div key={doc} className="flex items-center gap-2 text-sm">
                        <FileText className="h-4 w-4 text-gray-400" />
                        <span>{doc}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}; 