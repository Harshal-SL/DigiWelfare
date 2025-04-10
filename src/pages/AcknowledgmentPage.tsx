import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Download } from "lucide-react";
import { ApplicationStatusBar } from '@/components/ApplicationStatusBar';

interface ApplicationData {
  id: string;
  schemeId: string;
  schemeName: string;
  applicationFee: number;
  applicantName: string;
  applicantEmail: string;
  paymentStatus: 'completed';
}

export const AcknowledgmentPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const applicationData = location.state?.applicationData as ApplicationData | undefined;

  useEffect(() => {
    // If no application data or payment not completed, redirect to application page
    if (!applicationData || applicationData.paymentStatus !== 'completed') {
      navigate('/application');
    }
  }, [applicationData, navigate]);

  if (!applicationData) {
    return null;
  }

  const handleDownloadAcknowledgment = () => {
    // Create acknowledgment content
    const acknowledgmentContent = `
      AID LEDGER - APPLICATION ACKNOWLEDGMENT
      --------------------------------------
      
      Application ID: ${applicationData.id}
      Scheme Name: ${applicationData.schemeName}
      Applicant Name: ${applicationData.applicantName}
      Applicant Email: ${applicationData.applicantEmail}
      Application Fee: ₹${applicationData.applicationFee}
      Payment Status: Completed
      Date: ${new Date().toLocaleDateString()}
      
      This is to acknowledge that your application has been successfully submitted
      and the payment has been processed. Your application will now be reviewed
      by our team.
      
      Thank you for using AID Ledger.
    `;

    // Create blob and download
    const blob = new Blob([acknowledgmentContent], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `acknowledgment_${applicationData.id}.txt`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  };

  return (
    <div className="container mx-auto py-8">
      <div className="max-w-2xl mx-auto">
        <ApplicationStatusBar currentStep="acknowledgment" />
        
        <Card>
          <CardHeader>
            <CardTitle>Application Acknowledgment</CardTitle>
            <CardDescription>
              Your application has been successfully submitted and payment has been processed
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Application ID</span>
                <span className="text-sm">{applicationData.id}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Scheme Name</span>
                <span className="text-sm">{applicationData.schemeName}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Applicant Name</span>
                <span className="text-sm">{applicationData.applicantName}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Applicant Email</span>
                <span className="text-sm">{applicationData.applicantEmail}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Application Fee</span>
                <span className="text-lg font-semibold">₹{applicationData.applicationFee}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Payment Status</span>
                <Badge className="bg-green-100 text-green-800">
                  <CheckCircle2 className="mr-1 h-3 w-3" />
                  Completed
                </Badge>
              </div>
            </div>

            <div className="rounded-lg bg-green-50 p-4">
              <p className="text-sm text-green-800">
                Your application has been successfully submitted and the payment has been processed.
                You will receive updates about your application status via email.
              </p>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button
              variant="outline"
              onClick={() => navigate('/dashboard')}
            >
              Go to Dashboard
            </Button>
            <Button
              onClick={handleDownloadAcknowledgment}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Download className="mr-2 h-4 w-4" />
              Download Acknowledgment
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}; 