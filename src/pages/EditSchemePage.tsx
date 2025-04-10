import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, ArrowLeft, Plus, PlusCircle } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { schemes } from "@/data/mockData";
import { Checkbox } from "@/components/ui/checkbox";

const commonDocuments = [
  "Aadhaar Card",
  "PAN Card",
  "Voter ID",
  "Ration Card",
  "Income Certificate",
  "Caste Certificate",
  "Domicile Certificate",
  "Bank Passbook",
  "Passport",
  "Driving License",
  "Birth Certificate",
  "Marriage Certificate",
  "Death Certificate",
  "Disability Certificate",
  "Medical Certificate",
  "Property Documents",
  "Rent Agreement",
  "Electricity Bill",
  "Water Bill",
  "Gas Connection Bill"
];

const EditSchemePage = () => {
  const { schemeId } = useParams<{ schemeId: string }>();
  const navigate = useNavigate();
  const { user, isLoggedIn } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [customDocument, setCustomDocument] = useState("");
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    startDate: "",
    endDate: "",
    documents: [] as string[],
    eligibility: "",
    thumbnail: "",
    status: "active"
  });

  useEffect(() => {
    if (!isLoggedIn || user?.role !== "admin") {
      navigate("/login");
      return;
    }

    const scheme = schemes.find(s => s.id === schemeId);
    if (!scheme) {
      toast.error("Scheme not found");
      navigate("/admin");
      return;
    }

    setFormData({
      title: scheme.title,
      description: scheme.description,
      startDate: scheme.startDate,
      endDate: scheme.endDate,
      documents: scheme.documents,
      eligibility: scheme.eligibility.join(", "),
      thumbnail: scheme.thumbnail,
      status: scheme.status
    });
  }, [schemeId, isLoggedIn, user?.role, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Simulate API call to update scheme
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const updatedScheme = {
        id: schemeId,
        title: formData.title,
        description: formData.description,
        startDate: formData.startDate,
        endDate: formData.endDate,
        documents: formData.documents,
        eligibility: formData.eligibility.split(",").map(item => item.trim()),
        thumbnail: formData.thumbnail,
        status: formData.status
      };

      // Update in mock data (in a real app, this would be handled by the backend)
      const index = schemes.findIndex(s => s.id === schemeId);
      if (index !== -1) {
        schemes[index] = updatedScheme;
      }
      
      toast.success("Scheme updated successfully!");
      navigate("/admin");
    } catch (error) {
      console.error("Error updating scheme:", error);
      toast.error("Failed to update scheme. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleDocumentToggle = (document: string) => {
    setFormData(prev => ({
      ...prev,
      documents: prev.documents.includes(document)
        ? prev.documents.filter(d => d !== document)
        : [...prev.documents, document]
    }));
  };

  const handleAddCustomDocument = () => {
    if (customDocument.trim() && !formData.documents.includes(customDocument.trim())) {
      setFormData(prev => ({
        ...prev,
        documents: [...prev.documents, customDocument.trim()]
      }));
      setCustomDocument("");
      toast.success("Custom document added successfully!");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddCustomDocument();
    }
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-3xl mx-auto">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2 mb-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigate("/admin")}
                className="mr-2"
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <CardTitle>Edit Scheme</CardTitle>
            </div>
            <CardDescription>
              Update the details of the welfare scheme.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Scheme Title</Label>
                  <Input
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="Enter scheme title"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Enter scheme description"
                    required
                    rows={4}
                  />
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="startDate">Start Date</Label>
                    <Input
                      id="startDate"
                      name="startDate"
                      type="date"
                      value={formData.startDate}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="endDate">End Date</Label>
                    <Input
                      id="endDate"
                      name="endDate"
                      type="date"
                      value={formData.endDate}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Required Documents</Label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 border rounded-lg">
                    {commonDocuments.map((document) => (
                      <div key={document} className="flex items-center space-x-2">
                        <Checkbox
                          id={document}
                          checked={formData.documents.includes(document)}
                          onCheckedChange={() => handleDocumentToggle(document)}
                        />
                        <Label htmlFor={document} className="text-sm">
                          {document}
                        </Label>
                      </div>
                    ))}
                  </div>
                  
                  <div className="mt-4 flex gap-2">
                    <Input
                      value={customDocument}
                      onChange={(e) => setCustomDocument(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="Add custom document"
                      className="flex-1"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={handleAddCustomDocument}
                      disabled={!customDocument.trim()}
                    >
                      <PlusCircle className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  <p className="text-sm text-gray-500 mt-2">
                    Select from common documents or add custom ones using the + button
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="eligibility">Eligibility Criteria (comma-separated)</Label>
                  <Input
                    id="eligibility"
                    name="eligibility"
                    value={formData.eligibility}
                    onChange={handleChange}
                    placeholder="Age above 18, Income below 3 lakh, etc."
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="thumbnail">Thumbnail URL</Label>
                  <Input
                    id="thumbnail"
                    name="thumbnail"
                    value={formData.thumbnail}
                    onChange={handleChange}
                    placeholder="Enter image URL"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <select
                    id="status"
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border rounded-md"
                    required
                  >
                    <option value="active">Active</option>
                    <option value="upcoming">Upcoming</option>
                    <option value="closed">Closed</option>
                  </select>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full"
                disabled={isLoading || formData.documents.length === 0}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Updating...
                  </>
                ) : (
                  "Update Scheme"
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default EditSchemePage; 