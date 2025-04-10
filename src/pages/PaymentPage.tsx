import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, CheckCircle2, XCircle, CreditCard, Lock, Smartphone, Banknote, IndianRupee, QrCode } from "lucide-react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ApplicationStatusBar } from '@/components/ApplicationStatusBar';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { blockchainService } from "@/services/blockchainService";

interface ApplicationData {
  applicationNumber: string;
  schemeName: string;
  applicantName: string;
  applicantEmail: string;
  applicantPhone: string;
  applicantAddress: string;
  dateOfSubmission: string;
  status: string;
}

type PaymentMethod = 'card' | 'upi' | 'netbanking';

export const PaymentPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<'pending' | 'completed' | 'failed'>('pending');
  const [applicationData, setApplicationData] = useState<ApplicationData | null>(null);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<PaymentMethod>('card');
  const [cardDetails, setCardDetails] = useState({
    number: '',
    expiry: '',
    cvv: '',
    name: ''
  });
  const [upiId, setUpiId] = useState('');
  const [selectedBank, setSelectedBank] = useState('');

  const APPLICATION_FEE = 500;
  const CONVENIENCE_FEE = 12.5;
  const TAX_AMOUNT = 2.8;
  const TOTAL_AMOUNT = APPLICATION_FEE + CONVENIENCE_FEE + TAX_AMOUNT;

  useEffect(() => {
    if (location.state?.applicationData) {
      setApplicationData(location.state.applicationData);
    } else {
      toast.error("No application data found");
      navigate('/schemes');
    }
  }, [location.state, navigate]);

  const generateTransactionId = () => {
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 10000);
    return `TXN${timestamp}${random}`;
  };

  const handlePayment = async () => {
    if (!applicationData) {
      toast.error("No application data found");
      return;
    }

    setLoading(true);
    try {
      // Validate payment method specific fields
      if (selectedPaymentMethod === 'card') {
        if (!cardDetails.number || !cardDetails.expiry || !cardDetails.cvv || !cardDetails.name) {
          toast.error("Please fill in all card details");
          setLoading(false);
          return;
        }
      } else if (selectedPaymentMethod === 'upi') {
        if (!upiId) {
          toast.error("Please enter your UPI ID");
          setLoading(false);
          return;
        }
      } else if (selectedPaymentMethod === 'netbanking') {
        if (!selectedBank) {
          toast.error("Please select a bank");
          setLoading(false);
          return;
        }
      }

      // Generate transaction ID
      const transactionId = generateTransactionId();
      
      // Simulate payment processing with a shorter delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Log application submission to blockchain
      const applicationBlockchainData = {
        type: 'application_submission',
        applicationId: applicationData.applicationNumber,
        schemeName: applicationData.schemeName,
        applicantName: applicationData.applicantName,
        timestamp: new Date().toISOString(),
        status: 'submitted'
      };

      const applicationBlockchainResult = await blockchainService.logApplication(applicationBlockchainData);
      if (!applicationBlockchainResult.success) {
        throw new Error(applicationBlockchainResult.error || 'Failed to log application to blockchain');
      }
      console.log('Application Blockchain Hash:', applicationBlockchainResult.hash);
      
      // Log payment to blockchain
      const paymentBlockchainData = {
        type: 'payment',
        applicationId: applicationData.applicationNumber,
        transactionId: transactionId,
        amount: TOTAL_AMOUNT,
        paymentMethod: selectedPaymentMethod,
        timestamp: new Date().toISOString(),
        status: 'completed'
      };

      const paymentBlockchainResult = await blockchainService.logPayment(paymentBlockchainData);
      if (!paymentBlockchainResult.success) {
        throw new Error(paymentBlockchainResult.error || 'Failed to log payment to blockchain');
      }
      console.log('Payment Blockchain Hash:', paymentBlockchainResult.hash);

      // Update payment status
      setPaymentStatus('completed');
      toast.success('Payment successful!');
      
      // Navigate to acknowledgment page with all necessary data
      navigate('/acknowledgment', {
        state: {
          applicationData: {
            ...applicationData,
            paymentStatus: 'completed',
            paymentMethod: selectedPaymentMethod,
            amountPaid: TOTAL_AMOUNT,
            paymentDate: new Date().toISOString(),
            transactionId: transactionId,
            applicationFee: APPLICATION_FEE,
            convenienceFee: CONVENIENCE_FEE,
            taxAmount: TAX_AMOUNT,
            totalAmount: TOTAL_AMOUNT,
            applicationBlockchainHash: applicationBlockchainResult.hash,
            paymentBlockchainHash: paymentBlockchainResult.hash
          }
        },
        replace: true // This prevents back navigation to the payment page
      });
    } catch (error) {
      console.error('Payment failed:', error);
      setPaymentStatus('failed');
      toast.error(error instanceof Error ? error.message : 'Payment failed. Please try again.');
      setLoading(false);
    }
  };

  if (!applicationData) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <div className="max-w-2xl mx-auto">
        <ApplicationStatusBar currentStep="payment" />
        
        <Card>
          <CardHeader>
            <CardTitle>Application Fee Payment</CardTitle>
            <CardDescription>
              Complete your payment to proceed with the application
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Application Number</span>
                <span className="text-sm">{applicationData?.applicationNumber}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Scheme Name</span>
                <span className="text-sm">{applicationData?.schemeName}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Applicant Name</span>
                <span className="text-sm">{applicationData?.applicantName}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Applicant Email</span>
                <span className="text-sm">{applicationData?.applicantEmail}</span>
              </div>
            </div>

            <Separator className="my-4" />

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Application Fee</span>
                <span className="text-sm">₹{APPLICATION_FEE}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Convenience Fee</span>
                <span className="text-sm">₹{CONVENIENCE_FEE}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Tax</span>
                <span className="text-sm">₹{TAX_AMOUNT}</span>
              </div>
              <div className="flex justify-between items-center border-t pt-2">
                <span className="text-sm font-semibold">Total Amount</span>
                <span className="text-lg font-semibold">₹{TOTAL_AMOUNT}</span>
              </div>
            </div>

            <Tabs defaultValue="card" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="card" onClick={() => setSelectedPaymentMethod('card')}>
                  <CreditCard className="h-4 w-4 mr-2" />
                  Card
                </TabsTrigger>
                <TabsTrigger value="upi" onClick={() => setSelectedPaymentMethod('upi')}>
                  <Smartphone className="h-4 w-4 mr-2" />
                  UPI
                </TabsTrigger>
                <TabsTrigger value="netbanking" onClick={() => setSelectedPaymentMethod('netbanking')}>
                  <Banknote className="h-4 w-4 mr-2" />
                  Net Banking
                </TabsTrigger>
              </TabsList>

              <TabsContent value="card" className="space-y-4">
                <div className="rounded-lg border p-4 bg-gray-50">
                  <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
                    <Lock className="h-4 w-4" />
                    <span>Enter Card Details</span>
                  </div>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="cardNumber">Card Number</Label>
                      <Input
                        id="cardNumber"
                        placeholder="1234 5678 9012 3456"
                        value={cardDetails.number}
                        onChange={(e) => setCardDetails({ ...cardDetails, number: e.target.value })}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="expiry">Expiry Date</Label>
                        <Input
                          id="expiry"
                          placeholder="MM/YY"
                          value={cardDetails.expiry}
                          onChange={(e) => setCardDetails({ ...cardDetails, expiry: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="cvv">CVV</Label>
                        <Input
                          id="cvv"
                          placeholder="123"
                          value={cardDetails.cvv}
                          onChange={(e) => setCardDetails({ ...cardDetails, cvv: e.target.value })}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="cardName">Cardholder Name</Label>
                      <Input
                        id="cardName"
                        placeholder="John Doe"
                        value={cardDetails.name}
                        onChange={(e) => setCardDetails({ ...cardDetails, name: e.target.value })}
                      />
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="upi" className="space-y-4">
                <div className="rounded-lg border p-4 bg-gray-50">
                  <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
                    <Lock className="h-4 w-4" />
                    <span>Scan QR Code or Enter UPI ID</span>
                  </div>
                  <div className="space-y-4">
                    <div className="flex flex-col items-center space-y-4">
                      <div className="p-4 bg-white rounded-lg border">
                        <QrCode className="h-32 w-32" />
                        <p className="text-xs text-center mt-2">Scan to pay ₹{TOTAL_AMOUNT}</p>
                      </div>
                      <div className="text-sm text-gray-500">
                        Supported UPI Apps: Google Pay, PhonePe, Paytm, BHIM
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="upiId">Or Enter UPI ID</Label>
                      <Input
                        id="upiId"
                        placeholder="username@upi"
                        value={upiId}
                        onChange={(e) => setUpiId(e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="netbanking" className="space-y-4">
                <div className="rounded-lg border p-4 bg-gray-50">
                  <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
                    <Lock className="h-4 w-4" />
                    <span>Select Bank</span>
                  </div>
                  <RadioGroup
                    value={selectedBank}
                    onValueChange={setSelectedBank}
                    className="space-y-2"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="sbi" id="sbi" />
                      <Label htmlFor="sbi">State Bank of India</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="hdfc" id="hdfc" />
                      <Label htmlFor="hdfc">HDFC Bank</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="icici" id="icici" />
                      <Label htmlFor="icici">ICICI Bank</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="axis" id="axis" />
                      <Label htmlFor="axis">Axis Bank</Label>
                    </div>
                  </RadioGroup>
                </div>
              </TabsContent>
            </Tabs>

            <Button
              onClick={handlePayment}
              disabled={loading || paymentStatus === 'completed'}
              className="w-full bg-blue-600 hover:bg-blue-700"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing Payment...
                </>
              ) : paymentStatus === 'completed' ? (
                'Payment Completed'
              ) : (
                `Pay ₹${TOTAL_AMOUNT}`
              )}
            </Button>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Payment Status</span>
                {paymentStatus === 'pending' && (
                  <Badge variant="secondary">Pending</Badge>
                )}
                {paymentStatus === 'completed' && (
                  <Badge className="bg-green-100 text-green-800">
                    <CheckCircle2 className="mr-1 h-3 w-3" />
                    Completed
                  </Badge>
                )}
                {paymentStatus === 'failed' && (
                  <Badge className="bg-red-100 text-red-800">
                    <XCircle className="mr-1 h-3 w-3" />
                    Failed
                  </Badge>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}; 