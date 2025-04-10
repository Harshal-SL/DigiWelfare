import { useState, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, CheckCircle2, Wallet, Clock, CheckCircle, XCircle, FileText, Eye, Download, Upload, FileCheck } from "lucide-react";
import { toast } from "sonner";

interface Applicant {
  id: string;
  userId: string;
  schemeId: string;
  schemeName: string;
  name: string;
  email: string;
  status: 'pending' | 'approved' | 'rejected';
  applicationDate: string;
  documents: string[];
  eligibilityScore?: number;
  paymentStatus?: 'pending' | 'completed';
}

interface Scheme {
  id: string;
  name: string;
  description: string;
  applicants: Applicant[];
}

export const AdminApplicantsList = () => {
  const [schemes, setSchemes] = useState<Scheme[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedScheme, setSelectedScheme] = useState<string>('');
  const [selectedStatus, setSelectedStatus] = useState<'pending' | 'approved' | 'rejected'>('pending');
  const [processingPayment, setProcessingPayment] = useState<string | null>(null);
  const [showPaymentDialog, setShowPaymentDialog] = useState(false);
  const [selectedApplicant, setSelectedApplicant] = useState<Applicant | null>(null);
  const [paymentAmount, setPaymentAmount] = useState<string>('');
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);
  const [showDocumentsDialog, setShowDocumentsDialog] = useState(false);

  // Function to mask personal information
  const maskPersonalInfo = (info: string) => {
    if (!info) return '';
    const length = info.length;
    const visibleChars = Math.ceil(length * 0.3); // Show 30% of characters
    const maskedChars = length - visibleChars;
    const visiblePart = info.slice(0, visibleChars);
    const maskedPart = '*'.repeat(maskedChars);
    return visiblePart + maskedPart;
  };

  // Function to mask email
  const maskEmail = (email: string) => {
    if (!email) return '';
    const [username, domain] = email.split('@');
    const maskedUsername = maskPersonalInfo(username);
    return `${maskedUsername}@${domain}`;
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="secondary">Pending</Badge>;
      case 'approved':
        return <Badge variant="success">Approved</Badge>;
      case 'rejected':
        return <Badge variant="destructive">Rejected</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const getFilteredApplicants = (applicants: Applicant[]) => {
    if (selectedStatus === 'all') {
      return applicants;
    }
    return applicants.filter(applicant => applicant.status === selectedStatus);
  };

  const handleInitiatePayment = (applicant: Applicant) => {
    setSelectedApplicant(applicant);
    setShowPaymentDialog(true);
  };

  const handlePaymentSubmit = async () => {
    if (!selectedApplicant || !paymentAmount) return;

    setProcessingPayment(selectedApplicant.id);
    try {
      // Simulate API call to process payment
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Update payment status in local state
      setSchemes(prevSchemes => 
        prevSchemes.map(scheme => ({
          ...scheme,
          applicants: scheme.applicants.map(applicant => 
            applicant.id === selectedApplicant.id
              ? { ...applicant, paymentStatus: 'completed' }
              : applicant
          )
        }))
      );
      
      toast.success(`Payment of ${paymentAmount} initiated successfully!`);
      setShowPaymentDialog(false);
      setPaymentAmount('');
      setSelectedApplicant(null);
    } catch (error) {
      console.error('Error processing payment:', error);
      toast.error("Failed to process payment. Please try again.");
    } finally {
      setProcessingPayment(null);
    }
  };

  const handleStatusChange = async (applicantId: string, newStatus: 'approved' | 'rejected') => {
    try {
      // Simulate API call to update status
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Update status in local state
      setSchemes(prevSchemes => 
        prevSchemes.map(scheme => ({
          ...scheme,
          applicants: scheme.applicants.map(applicant => 
            applicant.id === applicantId
              ? { ...applicant, status: newStatus }
              : applicant
          )
        }))
      );
      
      toast.success(`Application ${newStatus === 'approved' ? 'approved' : 'rejected'} successfully!`);
    } catch (error) {
      console.error('Error updating status:', error);
      toast.error("Failed to update application status. Please try again.");
    }
  };

  const handleViewDetails = (applicant: Applicant) => {
    setSelectedApplicant(applicant);
    setShowDetailsDialog(true);
  };

  const handleViewDocuments = (applicant: Applicant) => {
    setSelectedApplicant(applicant);
    setShowDocumentsDialog(true);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const mockData: Scheme[] = [
          {
            id: '1',
            name: 'Education Support',
            description: 'Financial aid for education',
            applicants: [
              {
                id: '1',
                userId: 'AID123456',
                schemeId: '1',
                schemeName: 'Education Support',
                name: 'John Doe',
                email: 'john@example.com',
                status: 'pending',
                applicationDate: '2024-03-15',
                documents: ['document1.pdf', 'document2.pdf'],
                eligibilityScore: 85
              },
              {
                id: '2',
                userId: 'AID789012',
                schemeId: '1',
                schemeName: 'Education Support',
                name: 'Jane Smith',
                email: 'jane@example.com',
                status: 'approved',
                applicationDate: '2024-03-10',
                documents: ['document3.pdf'],
                eligibilityScore: 92,
                paymentStatus: 'pending'
              },
              {
                id: '12',
                userId: 'AID456123',
                schemeId: '1',
                schemeName: 'Education Support',
                name: 'Michael Brown',
                email: 'michael@example.com',
                status: 'pending',
                applicationDate: '2024-03-18',
                documents: ['document4.pdf'],
                eligibilityScore: 78
              },
              {
                id: '13',
                userId: 'AID789456',
                schemeId: '1',
                schemeName: 'Education Support',
                name: 'Sarah Wilson',
                email: 'sarah@example.com',
                status: 'pending',
                applicationDate: '2024-03-17',
                documents: ['document5.pdf'],
                eligibilityScore: 95
              }
            ]
          },
          {
            id: '2',
            name: 'Healthcare Support',
            description: 'Medical expense assistance',
            applicants: [
              {
                id: '3',
                userId: 'AID345678',
                schemeId: '2',
                schemeName: 'Healthcare Support',
                name: 'Alice Brown',
                email: 'alice@example.com',
                status: 'approved',
                applicationDate: '2024-03-12',
                documents: ['medical_report.pdf'],
                eligibilityScore: 78,
                paymentStatus: 'completed'
              },
              {
                id: '14',
                userId: 'AID123789',
                schemeId: '2',
                schemeName: 'Healthcare Support',
                name: 'David Lee',
                email: 'david@example.com',
                status: 'pending',
                applicationDate: '2024-03-19',
                documents: ['medical_report2.pdf'],
                eligibilityScore: 88
              },
              {
                id: '15',
                userId: 'AID456789',
                schemeId: '2',
                schemeName: 'Healthcare Support',
                name: 'Emily Davis',
                email: 'emily@example.com',
                status: 'pending',
                applicationDate: '2024-03-20',
                documents: ['medical_report3.pdf'],
                eligibilityScore: 65
              }
            ]
          },
          {
            id: '3',
            name: 'Housing Assistance',
            description: 'Support for housing and shelter',
            applicants: [
              {
                id: '4',
                userId: 'AID901234',
                schemeId: '3',
                schemeName: 'Housing Assistance',
                name: 'Bob Johnson',
                email: 'bob@example.com',
                status: 'pending',
                applicationDate: '2024-03-18',
                documents: ['rental_agreement.pdf'],
                eligibilityScore: 65
              },
              {
                id: '16',
                userId: 'AID789123',
                schemeId: '3',
                schemeName: 'Housing Assistance',
                name: 'Lisa Chen',
                email: 'lisa@example.com',
                status: 'pending',
                applicationDate: '2024-03-21',
                documents: ['rental_agreement2.pdf'],
                eligibilityScore: 82
              },
              {
                id: '17',
                userId: 'AID456012',
                schemeId: '3',
                schemeName: 'Housing Assistance',
                name: 'Robert Taylor',
                email: 'robert@example.com',
                status: 'pending',
                applicationDate: '2024-03-22',
                documents: ['rental_agreement3.pdf'],
                eligibilityScore: 75
              }
            ]
          },
          {
            id: '4',
            name: 'Food Security Program',
            description: 'Nutritional support and food assistance',
            applicants: [
              {
                id: '5',
                userId: 'AID567890',
                schemeId: '4',
                schemeName: 'Food Security Program',
                name: 'Charlie Wilson',
                email: 'charlie@example.com',
                status: 'approved',
                applicationDate: '2024-03-14',
                eligibilityScore: 88,
                paymentStatus: 'pending'
              },
              {
                id: '18',
                userId: 'AID123456',
                schemeId: '4',
                schemeName: 'Food Security Program',
                name: 'Patricia Moore',
                email: 'patricia@example.com',
                status: 'pending',
                applicationDate: '2024-03-23',
                documents: ['income_proof.pdf'],
                eligibilityScore: 92
              },
              {
                id: '19',
                userId: 'AID789012',
                schemeId: '4',
                schemeName: 'Food Security Program',
                name: 'James Anderson',
                email: 'james@example.com',
                status: 'pending',
                applicationDate: '2024-03-24',
                documents: ['income_proof2.pdf'],
                eligibilityScore: 70
              }
            ]
          },
          {
            id: '5',
            name: 'Employment Support',
            description: 'Job training and placement assistance',
            applicants: [
              {
                id: '6',
                userId: 'AID234567',
                schemeId: '5',
                schemeName: 'Employment Support',
                name: 'David Lee',
                email: 'david@example.com',
                status: 'rejected',
                applicationDate: '2024-03-16',
                documents: ['resume.pdf'],
                eligibilityScore: 45
              },
              {
                id: '20',
                userId: 'AID345678',
                schemeId: '5',
                schemeName: 'Employment Support',
                name: 'Jennifer White',
                email: 'jennifer@example.com',
                status: 'pending',
                applicationDate: '2024-03-25',
                documents: ['resume2.pdf'],
                eligibilityScore: 85
              },
              {
                id: '21',
                userId: 'AID901234',
                schemeId: '5',
                schemeName: 'Employment Support',
                name: 'Thomas Clark',
                email: 'thomas@example.com',
                status: 'pending',
                applicationDate: '2024-03-26',
                documents: ['resume3.pdf'],
                eligibilityScore: 78
              }
            ]
          }
        ];

        // Sort applicants by eligibilityScore in descending order for each scheme
        const sortedData = mockData.map(scheme => ({
          ...scheme,
          applicants: [...scheme.applicants].sort((a, b) => (b.eligibilityScore || 0) - (a.eligibilityScore || 0))
        }));

        setSchemes(sortedData);
        if (sortedData.length > 0) {
          setSelectedScheme(sortedData[0].id);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  const selectedSchemeData = schemes.find(scheme => scheme.id === selectedScheme);
  const filteredApplicants = selectedSchemeData?.applicants.filter(app => app.status === selectedStatus) || [];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Applications Management</h2>
        <Select value={selectedScheme} onValueChange={setSelectedScheme}>
          <SelectTrigger className="w-[250px]">
            <SelectValue placeholder="Select a scheme" />
          </SelectTrigger>
          <SelectContent>
            {schemes.map((scheme) => (
              <SelectItem key={scheme.id} value={scheme.id}>
                {scheme.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Tabs value={selectedStatus} onValueChange={(value) => setSelectedStatus(value as 'pending' | 'approved' | 'rejected')}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="pending" className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            <span>Pending</span>
          </TabsTrigger>
          <TabsTrigger value="approved" className="flex items-center gap-2">
            <CheckCircle className="h-4 w-4" />
            <span>Approved</span>
          </TabsTrigger>
          <TabsTrigger value="rejected" className="flex items-center gap-2">
            <XCircle className="h-4 w-4" />
            <span>Rejected</span>
          </TabsTrigger>
        </TabsList>
      </Tabs>

      {selectedScheme ? (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-lg font-semibold">{selectedSchemeData?.name}</h3>
              <p className="text-sm text-gray-500">{selectedSchemeData?.description}</p>
            </div>
            <p className="text-sm text-gray-500">
              {filteredApplicants.length} {selectedStatus} applications
            </p>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Applicant ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>AI Score</TableHead>
                <TableHead>Application Date</TableHead>
                {selectedStatus === 'approved' && <TableHead>Payment Status</TableHead>}
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredApplicants.map((applicant) => (
                <TableRow key={applicant.id}>
                  <TableCell>{applicant.userId}</TableCell>
                  <TableCell>{maskPersonalInfo(applicant.name)}</TableCell>
                  <TableCell>{maskEmail(applicant.email)}</TableCell>
                  <TableCell>
                    <Badge
                      className={
                        (applicant.eligibilityScore || 0) >= 70
                          ? "bg-green-100 text-green-800"
                          : (applicant.eligibilityScore || 0) >= 50
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-red-100 text-red-800"
                      }
                    >
                      {applicant.eligibilityScore || 0}%
                    </Badge>
                  </TableCell>
                  <TableCell>{new Date(applicant.applicationDate).toLocaleDateString()}</TableCell>
                  {selectedStatus === 'approved' && (
                    <TableCell>
                      {applicant.paymentStatus === 'completed' ? (
                        <Badge className="bg-green-100 text-green-800">
                          <div className="flex items-center gap-1">
                            <CheckCircle2 className="h-3 w-3" />
                            <span>Payment Done</span>
                          </div>
                        </Badge>
                      ) : (
                        <Badge className="bg-yellow-100 text-yellow-800">
                          <div className="flex items-center gap-1">
                            <Wallet className="h-3 w-3" />
                            <span>Payment Pending</span>
                          </div>
                        </Badge>
                      )}
                    </TableCell>
                  )}
                  <TableCell>
                    <div className="flex space-x-2">
                      {selectedStatus === 'pending' ? (
                        <>
                          <Button
                            variant="outline"
                            size="sm"
                            className="bg-green-50 text-green-700 hover:bg-green-100"
                            onClick={() => handleStatusChange(applicant.id, 'approved')}
                          >
                            <CheckCircle className="mr-2 h-4 w-4" />
                            Accept
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="bg-red-50 text-red-700 hover:bg-red-100"
                            onClick={() => handleStatusChange(applicant.id, 'rejected')}
                          >
                            <XCircle className="mr-2 h-4 w-4" />
                            Reject
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleViewDetails(applicant)}
                          >
                            View Details
                          </Button>
                        </>
                      ) : selectedStatus === 'approved' && applicant.paymentStatus !== 'completed' ? (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleInitiatePayment(applicant)}
                          disabled={processingPayment === applicant.id}
                        >
                          {processingPayment === applicant.id ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Processing...
                            </>
                          ) : (
                            <>
                              <Wallet className="mr-2 h-4 w-4" />
                              Initiate Payment
                            </>
                          )}
                        </Button>
                      ) : (
                        <>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleViewDetails(applicant)}
                          >
                            View Details
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleViewDocuments(applicant)}
                          >
                            View Documents
                          </Button>
                        </>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {filteredApplicants.length === 0 && (
            <div className="text-center py-8">
              <p className="text-gray-500">No {selectedStatus} applications found for this scheme.</p>
            </div>
          )}
        </div>
      ) : (
        <div className="text-center py-8">
          <p className="text-gray-500">Please select a scheme to view applications.</p>
        </div>
      )}

      <Dialog open={showDetailsDialog} onOpenChange={setShowDetailsDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Applicant Details</DialogTitle>
            <DialogDescription>
              View the complete information for this application.
            </DialogDescription>
          </DialogHeader>
          {selectedApplicant && (
            <div className="space-y-6">
              <div className="space-y-2">
                <h3 className="font-semibold">Application Status</h3>
                <Badge
                  className={
                    selectedApplicant.status === "approved"
                      ? "bg-green-100 text-green-800"
                      : selectedApplicant.status === "rejected"
                      ? "bg-red-100 text-red-800"
                      : "bg-yellow-100 text-yellow-800"
                  }
                >
                  {selectedApplicant.status.charAt(0).toUpperCase() + selectedApplicant.status.slice(1)}
                </Badge>
              </div>

              <div className="space-y-2">
                <h3 className="font-semibold">Applicant Information</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Name</p>
                    <p className="font-medium">{maskPersonalInfo(selectedApplicant.name)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Email</p>
                    <p className="font-medium">{maskEmail(selectedApplicant.email)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Applicant ID</p>
                    <p className="font-medium">{selectedApplicant.userId}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Application Date</p>
                    <p className="font-medium">{new Date(selectedApplicant.applicationDate).toLocaleDateString()}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="font-semibold">AI Score</h3>
                <Badge
                  className={
                    (selectedApplicant.eligibilityScore || 0) >= 70
                      ? "bg-green-100 text-green-800"
                      : (selectedApplicant.eligibilityScore || 0) >= 50
                      ? "bg-yellow-100 text-yellow-800"
                      : "bg-red-100 text-red-800"
                  }
                >
                  {selectedApplicant.eligibilityScore || 0}%
                </Badge>
              </div>

              <div className="space-y-2">
                <h3 className="font-semibold">Documents</h3>
                <div className="grid grid-cols-2 gap-2">
                  {selectedApplicant.documents.map((doc, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-gray-500" />
                      <span className="text-sm">{doc}</span>
                    </div>
                  ))}
                </div>
              </div>

              {selectedApplicant.status === 'approved' && (
                <div className="space-y-2">
                  <h3 className="font-semibold">Payment Status</h3>
                  {selectedApplicant.paymentStatus === 'completed' ? (
                    <Badge className="bg-green-100 text-green-800">
                      <div className="flex items-center gap-1">
                        <CheckCircle2 className="h-3 w-3" />
                        <span>Payment Completed</span>
                      </div>
                    </Badge>
                  ) : (
                    <Badge className="bg-yellow-100 text-yellow-800">
                      <div className="flex items-center gap-1">
                        <Wallet className="h-3 w-3" />
                        <span>Payment Pending</span>
                      </div>
                    </Badge>
                  )}
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={showDocumentsDialog} onOpenChange={setShowDocumentsDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Applicant Documents</DialogTitle>
            <DialogDescription>
              View and manage documents for {selectedApplicant?.name}
            </DialogDescription>
          </DialogHeader>
          {selectedApplicant && (
            <div className="space-y-6">
              <div className="space-y-2">
                <h3 className="font-semibold">Document Status</h3>
                <div className="grid grid-cols-3 gap-4">
                  <div className="rounded-lg border p-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Total Documents</span>
                      <Badge variant="outline">{selectedApplicant.documents.length}</Badge>
                    </div>
                  </div>
                  <div className="rounded-lg border p-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Verified</span>
                      <Badge className="bg-green-100 text-green-800">
                        {Math.floor(selectedApplicant.documents.length * 0.8)} {/* Example: 80% verified */}
                      </Badge>
                    </div>
                  </div>
                  <div className="rounded-lg border p-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Pending Review</span>
                      <Badge className="bg-yellow-100 text-yellow-800">
                        {Math.ceil(selectedApplicant.documents.length * 0.2)} {/* Example: 20% pending */}
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="font-semibold">Uploaded Documents</h3>
                <div className="space-y-4">
                  {selectedApplicant.documents.map((doc, index) => (
                    <div key={index} className="flex items-center justify-between rounded-lg border p-4">
                      <div className="flex items-center gap-3">
                        <FileText className="h-5 w-5 text-gray-500" />
                        <div>
                          <p className="font-medium">{doc}</p>
                          <p className="text-sm text-gray-500">
                            Uploaded on {new Date().toLocaleDateString()} {/* Example date */}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge
                          className={
                            index % 4 !== 0
                              ? "bg-green-100 text-green-800"
                              : "bg-yellow-100 text-yellow-800"
                          }
                        >
                          {index % 4 !== 0 ? "Verified" : "Pending Review"}
                        </Badge>
                        <Button variant="ghost" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-end space-x-2">
                <Button variant="outline" size="sm">
                  <Upload className="mr-2 h-4 w-4" />
                  Upload Additional Documents
                </Button>
                <Button variant="outline" size="sm">
                  <FileCheck className="mr-2 h-4 w-4" />
                  Verify All Documents
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={showPaymentDialog} onOpenChange={setShowPaymentDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Initiate Payment</DialogTitle>
            <DialogDescription>
              Enter the payment amount for {selectedApplicant?.name}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="amount" className="text-right">
                Amount
              </Label>
              <Input
                id="amount"
                type="number"
                placeholder="Enter amount"
                className="col-span-3"
                value={paymentAmount}
                onChange={(e) => setPaymentAmount(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              type="submit"
              onClick={handlePaymentSubmit}
              disabled={!paymentAmount || processingPayment === selectedApplicant?.id}
            >
              {processingPayment === selectedApplicant?.id ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                'Confirm Payment'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}; 