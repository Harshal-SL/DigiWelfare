
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/contexts/AuthContext";
import { Loader2, FileText, RefreshCw, Check } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription 
} from "@/components/ui/card";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";

// Define the form schema
const profileUpdateSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  phone: z.string().min(10, { message: "Phone number must be at least 10 digits." }),
  address: z.string().min(5, { message: "Address must be at least 5 characters." }),
  additionalInfo: z.string().optional(),
});

type ProfileUpdateValues = z.infer<typeof profileUpdateSchema>;

const ProfileUpdatePage = () => {
  const navigate = useNavigate();
  const { user, isLoggedIn } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [isFetchingDoc, setIsFetchingDoc] = useState(false);
  const [showDigilockerDialog, setShowDigilockerDialog] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<string | null>(null);
  
  // If not logged in, redirect to login
  useEffect(() => {
    if (!isLoggedIn) {
      toast.error("Please login to access your profile");
      navigate("/login");
    }
  }, [isLoggedIn, navigate]);

  // Set up form with default values
  const form = useForm<ProfileUpdateValues>({
    resolver: zodResolver(profileUpdateSchema),
    defaultValues: {
      name: user?.name || "",
      email: user?.email || "",
      phone: "",
      address: "",
      additionalInfo: "",
    },
  });

  // Mock documents data
  const documents = {
    incomeCertificate: user?.aadhaarId ? {
      id: "INC123456",
      issueDate: "2023-01-15",
      issuedBy: "Revenue Department",
      status: "valid"
    } : null,
    casteCertificate: user?.aadhaarId ? {
      id: "CST789012",
      issueDate: "2022-11-10", 
      issuedBy: "Social Welfare Department",
      status: "valid"
    } : null,
    rationCard: null,
    voterId: user?.aadhaarId ? {
      id: "VID901234",
      issueDate: "2020-03-05",
      issuedBy: "Election Commission",
      status: "valid"
    } : null,
  };

  const onSubmit = (values: ProfileUpdateValues) => {
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      console.log("Profile update data:", values);
      toast.success("Profile updated successfully!");
      setIsLoading(false);
    }, 1500);
  };

  // Function to fetch document from DigiLocker
  const fetchDocument = (documentType: string) => {
    setSelectedDocument(documentType);
    setShowDigilockerDialog(true);
  };

  // Function to handle DigiLocker document fetch
  const handleDigilockerFetch = () => {
    setIsFetchingDoc(true);
    
    // Simulate API call delay
    setTimeout(() => {
      setIsFetchingDoc(false);
      setShowDigilockerDialog(false);
      
      toast.success(`${selectedDocument} fetched successfully from DigiLocker`);
      
      // Update the documents state (in a real app you'd update your backend here)
      setSelectedDocument(null);
    }, 2000);
  };
  
  if (!isLoggedIn || !user) {
    return (
      <div className="min-h-[calc(100vh-200px)] flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-welfare-500" />
      </div>
    );
  }

  return (
    <div className="container max-w-4xl py-10 px-4 sm:px-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Update Your Profile</CardTitle>
          <CardDescription>
            Make changes to your profile or fetch additional documents from DigiLocker
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input {...field} type="email" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone Number</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Enter your phone number" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Address</FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        placeholder="Enter your full address"
                        className="resize-none"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <Separator className="my-8" />
              
              <div>
                <h3 className="text-lg font-semibold mb-4">Your Documents</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  These documents are fetched from DigiLocker and help you qualify for various welfare schemes
                </p>
                
                <div className="grid gap-4 md:grid-cols-2">
                  {Object.entries(documents).map(([key, doc]) => (
                    <Card key={key} className="p-4 border border-muted">
                      <div className="flex items-start space-x-4">
                        <div className="bg-muted p-2 rounded">
                          <FileText className="h-5 w-5 text-welfare-500" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</h4>
                          {doc ? (
                            <>
                              <p className="text-sm text-muted-foreground">ID: {doc.id}</p>
                              <p className="text-sm text-muted-foreground">Issued: {doc.issueDate}</p>
                              <div className="mt-2">
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  onClick={() => fetchDocument(key)}
                                >
                                  <RefreshCw className="h-3 w-3 mr-1" /> Update
                                </Button>
                              </div>
                            </>
                          ) : (
                            <>
                              <p className="text-sm text-muted-foreground mb-2">Not available</p>
                              <Button 
                                variant="secondary" 
                                size="sm"
                                onClick={() => fetchDocument(key)}
                              >
                                Fetch from DigiLocker
                              </Button>
                            </>
                          )}
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
              
              <FormField
                control={form.control}
                name="additionalInfo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Additional Information (Optional)</FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        placeholder="Any additional information you'd like to provide"
                        className="resize-none"
                      />
                    </FormControl>
                    <FormDescription>
                      This information will help us match you with suitable welfare schemes
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="flex justify-end pt-4">
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Updating...
                    </>
                  ) : "Save Changes"}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
      
      {/* DigiLocker Document Fetch Dialog */}
      <Dialog open={showDigilockerDialog} onOpenChange={setShowDigilockerDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>DigiLocker Document Fetch</DialogTitle>
            <DialogDescription>
              We will fetch your {selectedDocument?.replace(/([A-Z])/g, ' $1').trim()} from DigiLocker using your linked Aadhaar.
            </DialogDescription>
          </DialogHeader>
          
          <div className="bg-welfare-50 rounded-md p-3 text-sm">
            <p>This process requires access to your DigiLocker account, which is already linked to your AidLedger profile.</p>
          </div>
          
          {isFetchingDoc ? (
            <div className="py-6 flex flex-col items-center justify-center space-y-4">
              <Loader2 className="h-12 w-12 animate-spin text-welfare-500" />
              <p className="font-medium">Connecting to DigiLocker...</p>
              <p className="text-sm text-muted-foreground">Fetching your document</p>
            </div>
          ) : (
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowDigilockerDialog(false)}>
                Cancel
              </Button>
              <Button onClick={handleDigilockerFetch} className="gap-2">
                <Check className="h-4 w-4" />
                Confirm Fetch
              </Button>
            </DialogFooter>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProfileUpdatePage;
