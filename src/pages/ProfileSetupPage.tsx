
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
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { useAuth } from "@/contexts/AuthContext";
import { Loader2, ChevronDown, FileText, User } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

// Define the form schema
const profileFormSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  phone: z.string().min(10, { message: "Phone number must be at least 10 digits." }),
  gender: z.string().min(1, { message: "Please select a gender." }),
  dateOfBirth: z.string().min(1, { message: "Please enter your date of birth." }),
  address: z.string().min(5, { message: "Address must be at least 5 characters." }),
  additionalInfo: z.string().optional(),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

const ProfileSetupPage = () => {
  const navigate = useNavigate();
  const { isLoggedIn } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [isDocumentsOpen, setIsDocumentsOpen] = useState(false);
  const [userData, setUserData] = useState<any>(null);

  // Get the stored user data
  useEffect(() => {
    const tempData = localStorage.getItem("tempUserData");
    if (tempData) {
      setUserData(JSON.parse(tempData));
    } else if (!isLoggedIn) {
      // Redirect to registration if no temp data and not logged in
      toast.error("Please register first");
      navigate("/register");
    }
  }, [isLoggedIn, navigate]);

  // Set default form values from the fetched data
  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      gender: "",
      dateOfBirth: "",
      address: "",
      additionalInfo: "",
    },
  });

  // Update form values when userData changes
  useEffect(() => {
    if (userData) {
      form.reset({
        name: userData.name || "",
        email: userData.email || "",
        phone: userData.phone || "",
        gender: userData.gender || "",
        dateOfBirth: userData.dateOfBirth || "",
        address: userData.address || "",
        additionalInfo: "",
      });
    }
  }, [userData, form]);

  const onSubmit = (values: ProfileFormValues) => {
    setIsLoading(true);
    
    // Simulate API call to update profile
    setTimeout(() => {
      // Create registration payload
      const registrationData = {
        ...values,
        aadhaarId: userData?.aadhaarId,
        documents: userData?.documents,
        role: "user"
      };
      
      console.log("Registration data:", registrationData);
      
      // Clear temporary storage
      localStorage.removeItem("tempUserData");
      
      toast.success("Profile setup complete!");
      setIsLoading(false);
      
      // Redirect to login page after successful registration
      navigate("/login");
    }, 1500);
  };

  if (!userData) {
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
          <div className="flex items-center gap-2 mb-2">
            <div className="bg-welfare-500 text-white p-2 rounded-md">
              <User size={20} />
            </div>
            <CardTitle>Complete Your Profile</CardTitle>
          </div>
          <CardDescription>
            Review and update your profile information fetched from DigiLocker
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
                      <FormDescription>
                        Your name as per DigiLocker records
                      </FormDescription>
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
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="gender"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Gender</FormLabel>
                      <Select 
                        onValueChange={field.onChange} 
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select gender" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Male">Male</SelectItem>
                          <SelectItem value="Female">Female</SelectItem>
                          <SelectItem value="Other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="dateOfBirth"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Date of Birth</FormLabel>
                      <FormControl>
                        <Input {...field} type="date" />
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
              
              <Separator />
              
              <Collapsible
                open={isDocumentsOpen}
                onOpenChange={setIsDocumentsOpen}
                className="space-y-4"
              >
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">Documents from DigiLocker</h3>
                  <CollapsibleTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <ChevronDown className={`h-4 w-4 transition-transform ${isDocumentsOpen ? "transform rotate-180" : ""}`} />
                      <span className="sr-only">Toggle</span>
                    </Button>
                  </CollapsibleTrigger>
                </div>
                
                <CollapsibleContent className="space-y-4">
                  {userData?.documents && Object.entries(userData.documents).map(([key, doc]: [string, any]) => (
                    <Card key={key} className="p-4 border border-muted">
                      <div className="flex items-start space-x-4">
                        <div className="bg-muted p-2 rounded">
                          <FileText className="h-5 w-5 text-welfare-500" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</h4>
                          <p className="text-sm text-muted-foreground">ID: {doc.id}</p>
                          <p className="text-sm text-muted-foreground">Issued: {doc.issueDate}</p>
                          <p className="text-sm text-muted-foreground">By: {doc.issuedBy}</p>
                          <div className={`mt-1 inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                            doc.status === 'valid' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {doc.status === 'valid' ? 'Valid' : 'Review Required'}
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))}
                </CollapsibleContent>
              </Collapsible>
              
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
                      This information will be used for better scheme matching
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <CardFooter className="flex justify-end px-0 pt-4">
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving Profile...
                    </>
                  ) : "Complete Registration"}
                </Button>
              </CardFooter>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfileSetupPage;
