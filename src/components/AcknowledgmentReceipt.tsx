import React, { useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Download } from "lucide-react";
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { toast } from "sonner";

interface AcknowledgmentReceiptProps {
  applicationData: {
    applicationNumber: string;
    schemeName: string;
    applicantName: string;
    dateOfSubmission: string;
    applicantEmail: string;
    applicantPhone: string;
    applicantAddress: string;
    status: string;
  };
}

const AcknowledgmentReceipt: React.FC<AcknowledgmentReceiptProps> = ({ applicationData }) => {
  const receiptRef = useRef<HTMLDivElement>(null);
  const [isDownloading, setIsDownloading] = React.useState(false);

  const handleDownload = async () => {
    if (!receiptRef.current) return;
    
    setIsDownloading(true);
    try {
      const receipt = receiptRef.current;
      
      const canvas = await html2canvas(receipt, {
        scale: 2,
        logging: false,
        useCORS: true,
        backgroundColor: '#ffffff'
      });
      
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });
      
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`${applicationData.applicationNumber}.pdf`);
      
      toast.success("Acknowledgment receipt downloaded successfully!");
    } catch (error) {
      console.error('Error generating PDF:', error);
      toast.error("Failed to download receipt. Please try again.");
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <div ref={receiptRef}>
        <Card className="shadow-lg" id="acknowledgment-receipt">
          <CardHeader className="text-center bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-t-lg">
            <CardTitle className="text-2xl font-bold">Application Acknowledgment</CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            <div className="text-center mb-6">
              <h2 className="text-xl font-semibold text-gray-800">DigiWelfare Scheme Application</h2>
              <p className="text-gray-600">Application Successfully Submitted</p>
            </div>
            
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="space-y-2">
                <p className="font-semibold">Application Number:</p>
                <p className="text-blue-600 font-mono">{applicationData.applicationNumber}</p>
              </div>
              <div className="space-y-2">
                <p className="font-semibold">Date of Submission:</p>
                <p>{applicationData.dateOfSubmission}</p>
              </div>
              <div className="space-y-2">
                <p className="font-semibold">Scheme Name:</p>
                <p>{applicationData.schemeName}</p>
              </div>
              <div className="space-y-2">
                <p className="font-semibold">Status:</p>
                <p className="text-green-600 font-semibold">{applicationData.status}</p>
              </div>
            </div>

            <div className="border-t border-gray-200 pt-4 mt-4">
              <h3 className="font-semibold mb-2">Applicant Details</h3>
              <div className="space-y-2 text-sm">
                <p><span className="font-semibold">Name:</span> {applicationData.applicantName}</p>
                <p><span className="font-semibold">Email:</span> {applicationData.applicantEmail}</p>
                <p><span className="font-semibold">Phone:</span> {applicationData.applicantPhone}</p>
                <p><span className="font-semibold">Address:</span> {applicationData.applicantAddress}</p>
              </div>
            </div>

            <div className="text-center text-xs text-gray-500 mt-6">
              <p>Please keep this acknowledgment for future reference.</p>
              <p>For any queries, please contact DigiWelfare support.</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="mt-4 text-center">
        <Button
          onClick={handleDownload}
          disabled={isDownloading}
          className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded inline-flex items-center gap-2"
        >
          {isDownloading ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
              Generating PDF...
            </>
          ) : (
            <>
              <Download className="h-4 w-4" />
              Download Acknowledgment
            </>
          )}
        </Button>
      </div>
    </div>
  );
};

export default AcknowledgmentReceipt; 