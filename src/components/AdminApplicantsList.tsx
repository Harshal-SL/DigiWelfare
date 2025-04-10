import { useState, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/ui/table";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { Loader2, CheckCircle2, Wallet, Clock, CheckCircle, XCircle, MessageSquare } from "lucide-react";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "../components/ui/dialog";
import { Textarea } from "../components/ui/textarea";
import { logToBlockchain } from "../utils/blockchainLogger";

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
  adminComment?: string;
  transactionHash?: string;
  paymentTimestamp?: string;
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
  const [selectedApplicant, setSelectedApplicant] = useState<Applicant | null>(null);
  const [rejectionComment, setRejectionComment] = useState('');
  const [isRejectDialogOpen, setIsRejectDialogOpen] = useState(false);

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

  const handleInitiatePayment = async (applicantId: string) => {
    setProcessingPayment(applicantId);
    try {
      // Find the applicant and scheme details
      const applicant = selectedSchemeData?.applicants.find(app => app.id === applicantId);
      if (!applicant || !selectedSchemeData) {
        throw new Error('Applicant or scheme not found');
      }

      // Simulate API call to initiate payment
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Log to blockchain
      const blockchainLog = await logToBlockchain({
        applicantId: applicant.userId,
        schemeId: selectedSchemeData.id,
        amount: 10000, // Fixed amount for demonstration
        metadata: {
          applicantName: applicant.name,
          schemeName: selectedSchemeData.name,
          eligibilityScore: applicant.eligibilityScore || 0,
        },
      });

      // Update payment status in local state
      setSchemes(prevSchemes => 
        prevSchemes.map(scheme => ({
          ...scheme,
          applicants: scheme.applicants.map(applicant => 
            applicant.id === applicantId
              ? { 
                  ...applicant, 
                  paymentStatus: 'completed',
                  transactionHash: blockchainLog.transactionHash,
                  paymentTimestamp: blockchainLog.timestamp
                }
              : applicant
          )
        }))
      );
      
      toast.success("Payment initiated successfully!");
      console.log('Payment Transaction Details:', {
        transactionHash: blockchainLog.transactionHash,
        timestamp: blockchainLog.timestamp,
        applicantDetails: {
          id: applicant.userId,
          name: applicant.name,
          scheme: selectedSchemeData.name,
        }
      });
    } catch (error) {
      console.error('Error initiating payment:', error);
      toast.error("Failed to initiate payment. Please try again.");
    } finally {
      setProcessingPayment(null);
    }
  };

  const handleApprove = async (applicantId: string) => {
    try {
      // Simulate API call to approve application
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setSchemes(prevSchemes => 
        prevSchemes.map(scheme => ({
          ...scheme,
          applicants: scheme.applicants.map(applicant => 
            applicant.id === applicantId
              ? { ...applicant, status: 'approved' }
              : applicant
          )
        }))
      );
      
      toast.success("Application approved successfully!");
    } catch (error) {
      console.error('Error approving application:', error);
      toast.error("Failed to approve application. Please try again.");
    }
  };

  const handleReject = (applicant: Applicant) => {
    setSelectedApplicant(applicant);
    setIsRejectDialogOpen(true);
  };

  const handleConfirmReject = async () => {
    if (!selectedApplicant || !rejectionComment.trim()) return;

    try {
      // Simulate API call to reject application
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setSchemes(prevSchemes => 
        prevSchemes.map(scheme => ({
          ...scheme,
          applicants: scheme.applicants.map(applicant => 
            applicant.id === selectedApplicant.id
              ? { ...applicant, status: 'rejected', adminComment: rejectionComment }
              : applicant
          )
        }))
      );
      
      toast.success("Application rejected successfully!");
      setIsRejectDialogOpen(false);
      setRejectionComment('');
      setSelectedApplicant(null);
    } catch (error) {
      console.error('Error rejecting application:', error);
      toast.error("Failed to reject application. Please try again.");
    }
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
                documents: ['income_proof.pdf'],
                eligibilityScore: 88,
                paymentStatus: 'pending'
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
              }
            ]
          },
          {
            id: '6',
            name: 'Disability Support',
            description: 'Assistance for persons with disabilities',
            applicants: [
              {
                id: '7',
                userId: 'AID890123',
                schemeId: '6',
                schemeName: 'Disability Support',
                name: 'Emma Davis',
                email: 'emma@example.com',
                status: 'pending',
                applicationDate: '2024-03-19',
                documents: ['disability_certificate.pdf'],
                eligibilityScore: 95
              }
            ]
          },
          {
            id: '7',
            name: 'Senior Citizen Support',
            description: 'Welfare programs for elderly citizens',
            applicants: [
              {
                id: '8',
                userId: 'AID456789',
                schemeId: '7',
                schemeName: 'Senior Citizen Support',
                name: 'Frank Miller',
                email: 'frank@example.com',
                status: 'approved',
                applicationDate: '2024-03-13',
                documents: ['age_proof.pdf'],
                eligibilityScore: 82,
                paymentStatus: 'completed'
              }
            ]
          },
          {
            id: '8',
            name: 'Child Welfare Program',
            description: 'Support for children and families',
            applicants: [
              {
                id: '9',
                userId: 'AID012345',
                schemeId: '8',
                schemeName: 'Child Welfare Program',
                name: 'Grace Taylor',
                email: 'grace@example.com',
                status: 'pending',
                applicationDate: '2024-03-17',
                documents: ['child_birth_certificate.pdf'],
                eligibilityScore: 75
              }
            ]
          },
          {
            id: '9',
            name: 'Rural Development Support',
            description: 'Development programs for rural areas',
            applicants: [
              {
                id: '10',
                userId: 'AID678901',
                schemeId: '9',
                schemeName: 'Rural Development Support',
                name: 'Henry Wilson',
                email: 'henry@example.com',
                status: 'approved',
                applicationDate: '2024-03-11',
                documents: ['land_documents.pdf'],
                eligibilityScore: 70,
                paymentStatus: 'pending'
              }
            ]
          },
          {
            id: '10',
            name: 'Women Empowerment Program',
            description: 'Support for women entrepreneurs',
            applicants: [
              {
                id: '11',
                userId: 'AID345012',
                schemeId: '10',
                schemeName: 'Women Empowerment Program',
                name: 'Isabella Clark',
                email: 'isabella@example.com',
                status: 'rejected',
                applicationDate: '2024-03-20',
                documents: ['business_plan.pdf'],
                eligibilityScore: 50
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
      </div>

      <div className="flex items-center gap-4">
        <Select value={selectedScheme} onValueChange={setSelectedScheme}>
          <SelectTrigger className="w-[200px]">
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
      </div>

      {selectedSchemeData ? (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">{selectedSchemeData.name}</h3>
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
                {selectedStatus === 'rejected' && <TableHead>Rejection Reason</TableHead>}
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredApplicants.map((applicant) => (
                <TableRow key={applicant.id}>
                  <TableCell>{applicant.userId}</TableCell>
                  <TableCell>{applicant.name}</TableCell>
                  <TableCell>{applicant.email}</TableCell>
                  <TableCell>
                    <Badge variant={applicant.eligibilityScore && applicant.eligibilityScore >= 70 ? "success" : "warning"}>
                      {applicant.eligibilityScore}%
                    </Badge>
                  </TableCell>
                  <TableCell>{new Date(applicant.applicationDate).toLocaleDateString()}</TableCell>
                  {selectedStatus === 'approved' && (
                    <TableCell>
                      {applicant.paymentStatus === 'completed' ? (
                        <Badge variant="success">Completed</Badge>
                      ) : (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleInitiatePayment(applicant.id)}
                          disabled={processingPayment === applicant.id}
                        >
                          {processingPayment === applicant.id ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Wallet className="h-4 w-4" />
                          )}
                          <span className="ml-2">Initiate Payment</span>
                        </Button>
                      )}
                    </TableCell>
                  )}
                  {selectedStatus === 'rejected' && (
                    <TableCell>
                      {applicant.adminComment ? (
                        <div className="flex items-center gap-2">
                          <MessageSquare className="h-4 w-4 text-gray-500" />
                          <span className="text-sm text-gray-600">{applicant.adminComment}</span>
                        </div>
                      ) : (
                        <span className="text-sm text-gray-500">No comment provided</span>
                      )}
                    </TableCell>
                  )}
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {selectedStatus === 'pending' && (
                        <>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleApprove(applicant.id)}
                          >
                            <CheckCircle2 className="h-4 w-4" />
                            <span className="ml-2">Approve</span>
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleReject(applicant)}
                          >
                            <XCircle className="h-4 w-4" />
                            <span className="ml-2">Reject</span>
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

      {/* Reject Application Dialog */}
      <Dialog open={isRejectDialogOpen} onOpenChange={setIsRejectDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject Application</DialogTitle>
            <DialogDescription>
              Please provide a reason for rejecting this application. This comment will be visible to the applicant.
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
                setRejectionComment('');
                setSelectedApplicant(null);
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
    </div>
  );
}; 