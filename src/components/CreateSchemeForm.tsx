import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from "../components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../components/ui/form";
import { Input } from "../components/ui/input";
import { Textarea } from "../components/ui/textarea";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Loader2 } from "lucide-react";
import { Checkbox } from "../components/ui/checkbox";
import { Label } from "../components/ui/label";

const documentOptions = [
  { id: "aadhaar", label: "Aadhaar Card" },
  { id: "pan", label: "PAN Card" },
  { id: "voter", label: "Voter ID" },
  { id: "passport", label: "Passport" },
  { id: "driving", label: "Driving License" },
  { id: "ration", label: "Ration Card" },
  { id: "income", label: "Income Certificate" },
  { id: "caste", label: "Caste Certificate" },
  { id: "domicile", label: "Domicile Certificate" },
  { id: "bank", label: "Bank Passbook" },
  { id: "land", label: "Land Records" },
  { id: "photo", label: "Recent Photograph" },
  { id: "medical", label: "Medical Certificate" },
  { id: "disability", label: "Disability Certificate" },
  { id: "birth", label: "Birth Certificate" },
  { id: "death", label: "Death Certificate" },
  { id: "marriage", label: "Marriage Certificate" },
  { id: "education", label: "Educational Certificates" },
  { id: "employment", label: "Employment Certificate" },
  { id: "property", label: "Property Documents" },
  { id: "rental", label: "Rental Agreement" },
  { id: "electricity", label: "Electricity Bill" },
  { id: "water", label: "Water Bill" },
  { id: "gas", label: "Gas Connection" },
  { id: "mobile", label: "Mobile Bill" },
  { id: "bpl", label: "BPL Certificate" },
  { id: "family", label: "Family Card" },
  { id: "pension", label: "Pension Card" },
  { id: "health", label: "Health Insurance" },
  { id: "other", label: "Other Documents" }
];

const formSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  documentsRequired: z.array(z.string()).min(1, "At least one document is required"),
  eligibilityCriteria: z.string().min(1, "Eligibility criteria is required"),
  startDate: z.string().min(1, "Start date is required"),
  endDate: z.string().min(1, "End date is required"),
  registrationFee: z.string().optional(),
});

interface CreateSchemeFormProps {
  onSubmit: (data: any) => void;
}

export const CreateSchemeForm = ({ onSubmit }: CreateSchemeFormProps) => {
  const [selectedDocuments, setSelectedDocuments] = useState<string[]>([]);
  const [otherDocuments, setOtherDocuments] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      documentsRequired: [],
      eligibilityCriteria: "",
      startDate: "",
      endDate: "",
      registrationFee: "",
    },
  });

  const handleDocumentChange = (documentId: string) => {
    setSelectedDocuments(prev => {
      if (prev.includes(documentId)) {
        return prev.filter(id => id !== documentId);
      } else {
        return [...prev, documentId];
      }
    });
  };

  const handleSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setIsLoading(true);
      // Combine selected documents with other documents
      const allDocuments = [
        ...selectedDocuments.map(id => documentOptions.find(doc => doc.id === id)?.label || id),
        ...(otherDocuments ? otherDocuments.split(',').map(doc => doc.trim()) : [])
      ];

      const formData = {
        ...values,
        documentsRequired: allDocuments,
      };

      await onSubmit(formData);
      toast.success("Scheme created successfully!");
      form.reset();
    } catch (error) {
      console.error("Error creating scheme:", error);
      toast.error("Failed to create scheme. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create New Scheme</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Scheme Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter scheme title" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Enter scheme description"
                      className="min-h-[100px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="space-y-4">
              <Label>Required Documents</Label>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {documentOptions.map((doc) => (
                  <div key={doc.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={doc.id}
                      checked={selectedDocuments.includes(doc.id)}
                      onCheckedChange={() => handleDocumentChange(doc.id)}
                    />
                    <Label htmlFor={doc.id}>{doc.label}</Label>
                  </div>
                ))}
              </div>
              
              <div className="space-y-2">
                <Label>Other Documents (comma separated)</Label>
                <Input
                  placeholder="Enter other required documents"
                  value={otherDocuments}
                  onChange={(e) => setOtherDocuments(e.target.value)}
                />
                <p className="text-sm text-gray-500">
                  Enter any additional documents not listed above, separated by commas
                </p>
              </div>
            </div>

            <FormField
              control={form.control}
              name="eligibilityCriteria"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Eligibility Criteria</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Enter eligibility criteria"
                      className="min-h-[100px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="startDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Start Date</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="endDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>End Date</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="registrationFee"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Registration Fee (Optional)</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="Enter registration fee" {...field} />
                  </FormControl>
                  <FormDescription>
                    Leave empty if there is no registration fee
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" disabled={isLoading} className="w-full">
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                "Create Scheme"
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}; 