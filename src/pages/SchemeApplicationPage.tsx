import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, ArrowLeft, FileText, Upload } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { schemes } from "@/data/mockData";

const SchemeApplicationPage = () => {
  const { schemeId } = useParams<{ schemeId: string }>();
  const navigate = useNavigate();
  const { user, isLoggedIn } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [scheme, setScheme] = useState(schemes.find(s => s.id === schemeId));
  const [additionalInfo, setAdditionalInfo] = useState("");
  const [documents, setDocuments] = useState<File[]>([]);

  useEffect(() => {
    if (!isLoggedIn) {
      toast.error("Please login to apply for this scheme");
      navigate("/login");
      return;
    }

    if (!scheme) {
      toast.error("Scheme not found");
      navigate("/schemes");
      return;
    }
  }, [isLoggedIn, navigate, scheme]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setDocuments(Array.from(e.target.files));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Simulate API call to submit application
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // In a real application, this would:
      // 1. Upload documents to storage
      // 2. Create application record in database
      // 3. Send confirmation email
      
      toast.success("Application submitted successfully!");
      navigate("/dashboard");
    } catch (error) {
      console.error("Error submitting application:", error);
      toast.error("Failed to submit application. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (!scheme || !isLoggedIn) {
    return null; // Will redirect
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-3xl mx-auto">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2 mb-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigate(`/schemes/${schemeId}`)}
                className="mr-2"
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <CardTitle>Apply for {scheme.title}</CardTitle>
            </div>
            <CardDescription>
              Please fill out the application form and upload the required documents.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Basic Information */}
              <div className="space-y-4">
                <h3 className="font-semibold">Basic Information</h3>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      value={user?.name || ""}
                      disabled
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      value={user?.email || ""}
                      disabled
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="Enter your phone number"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Required Documents */}
              <div className="space-y-4">
                <h3 className="font-semibold">Required Documents</h3>
                <div className="space-y-2">
                  <Label>Upload Documents</Label>
                  <div className="flex items-center gap-2">
                    <Input
                      type="file"
                      multiple
                      onChange={handleFileChange}
                      className="cursor-pointer"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={() => document.querySelector('input[type="file"]')?.click()}
                    >
                      <Upload className="h-4 w-4" />
                    </Button>
                  </div>
                  <p className="text-sm text-gray-500">
                    Upload the following documents: {scheme.documents.join(", ")}
                  </p>
                </div>
              </div>

              {/* Additional Information */}
              <div className="space-y-4">
                <h3 className="font-semibold">Additional Information</h3>
                <div className="space-y-2">
                  <Label htmlFor="additionalInfo">Additional Details (Optional)</Label>
                  <Textarea
                    id="additionalInfo"
                    value={additionalInfo}
                    onChange={(e) => setAdditionalInfo(e.target.value)}
                    placeholder="Add any additional information that might help with your application..."
                    rows={4}
                  />
                </div>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full"
                disabled={isLoading || documents.length === 0}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  "Submit Application"
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SchemeApplicationPage; 