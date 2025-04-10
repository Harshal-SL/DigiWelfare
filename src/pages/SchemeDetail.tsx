
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { schemes } from "@/data/mockData";
import { Button } from "@/components/ui/button";
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { 
  AlertCircle,
  Calendar,
  CheckCircle2,
  ChevronLeft,
  Download,
  ExternalLink,
  FileText,
  Users
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

const SchemeDetail = () => {
  const { schemeId } = useParams<{ schemeId: string }>();
  const navigate = useNavigate();
  const { user, isLoggedIn } = useAuth();
  const [scheme, setScheme] = useState(schemes.find(s => s.id === schemeId));

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  if (!scheme) {
    return (
      <div className="container mx-auto py-12 px-4 text-center">
        <AlertCircle className="mx-auto h-12 w-12 text-red-500 mb-4" />
        <h1 className="text-2xl font-bold mb-4">Scheme Not Found</h1>
        <p className="text-gray-600 mb-6">The scheme you're looking for doesn't exist or has been removed.</p>
        <Button onClick={() => navigate("/schemes")}>View All Schemes</Button>
      </div>
    );
  }

  const handleApply = () => {
    if (!isLoggedIn) {
      toast.error("Please login to apply for this scheme");
      navigate("/login");
      return;
    }
    
    // In a real application, this would navigate to an application form
    toast.success("Application process initiated");
    navigate(`/schemes/${schemeId}/apply`);
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <Button 
        variant="ghost" 
        className="mb-6 flex items-center"
        onClick={() => navigate("/schemes")}
      >
        <ChevronLeft className="mr-2 h-4 w-4" />
        Back to Schemes
      </Button>
      
      <div className="grid md:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="md:col-span-2">
          <div className="mb-6">
            <div className="flex items-center mb-4">
              <h1 className="text-3xl font-bold mr-3">{scheme.title}</h1>
              <Badge className={
                scheme.status === 'active' ? 'bg-green-100 text-green-800 hover:bg-green-100' : 
                scheme.status === 'upcoming' ? 'bg-blue-100 text-blue-800 hover:bg-blue-100' : 
                'bg-gray-100 text-gray-800 hover:bg-gray-100'
              }>
                {scheme.status.charAt(0).toUpperCase() + scheme.status.slice(1)}
              </Badge>
            </div>
            <p className="text-gray-600 text-lg">{scheme.description}</p>
          </div>
          
          <div className="mb-8">
            <img 
              src={scheme.thumbnail} 
              alt={scheme.title} 
              className="w-full h-64 object-cover rounded-lg"
            />
          </div>
          
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold mb-3">Scheme Overview</h2>
              <p className="text-gray-700">
                The {scheme.title} is designed to provide support to eligible citizens through financial assistance and resources. 
                This scheme is part of the government's initiative to ensure social welfare reaches those who need it most.
              </p>
            </div>
            
            <Separator />
            
            <div>
              <h2 className="text-xl font-semibold mb-3">Benefits</h2>
              <p className="text-gray-700 mb-4">{scheme.benefits}</p>
              <div className="bg-green-50 border border-green-100 rounded-md p-4">
                <div className="flex items-start">
                  <CheckCircle2 className="text-green-600 mt-1 mr-3" />
                  <div>
                    <h3 className="font-medium text-green-800">Key Highlight</h3>
                    <p className="text-green-700">
                      All disbursements under this scheme are verified through blockchain technology, ensuring transparency and security.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            <Separator />
            
            <div>
              <h2 className="text-xl font-semibold mb-3">Eligibility Criteria</h2>
              <ul className="space-y-3">
                {scheme.eligibility.map((criterion, index) => (
                  <li key={index} className="flex items-start">
                    <CheckCircle2 className="text-green-600 mt-1 mr-3" size={18} />
                    <span className="text-gray-700">{criterion}</span>
                  </li>
                ))}
              </ul>
            </div>
            
            <Separator />
            
            <div>
              <h2 className="text-xl font-semibold mb-3">Required Documents</h2>
              <ul className="space-y-3">
                {scheme.documents.map((document, index) => (
                  <li key={index} className="flex items-start">
                    <FileText className="text-welfare-600 mt-1 mr-3" size={18} />
                    <span className="text-gray-700">{document}</span>
                  </li>
                ))}
              </ul>
            </div>
            
            <Separator />
            
            <div>
              <h2 className="text-xl font-semibold mb-3">Frequently Asked Questions</h2>
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="item-1">
                  <AccordionTrigger>How do I apply for this scheme?</AccordionTrigger>
                  <AccordionContent>
                    To apply for this scheme, you need to log in with your Aadhaar via DigiLocker integration, 
                    click on the "Apply Now" button, and fill out the application form with the required details and documents.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-2">
                  <AccordionTrigger>How long does the application process take?</AccordionTrigger>
                  <AccordionContent>
                    The initial review of your application takes about 7-10 working days. 
                    After that, if all the information is verified, the benefits will be disbursed within 15 working days.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-3">
                  <AccordionTrigger>What happens if my application is rejected?</AccordionTrigger>
                  <AccordionContent>
                    If your application is rejected, you will receive a notification with the reason for rejection. 
                    You can address the issues and reapply if eligible. You can also file an appeal within 30 days of rejection.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-4">
                  <AccordionTrigger>Is there any way to track my application?</AccordionTrigger>
                  <AccordionContent>
                    Yes, once you submit your application, you will receive an acknowledgment with a unique application ID. 
                    You can use this ID to track the status of your application through your dashboard.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          </div>
        </div>
        
        {/* Sidebar */}
        <div className="md:col-span-1">
          <div className="bg-white border rounded-lg p-6 shadow-sm sticky top-8">
            <div className="space-y-5">
              <div>
                <h3 className="font-semibold mb-2">Scheme Timeline</h3>
                <div className="flex items-center text-sm text-gray-600 mb-1">
                  <Calendar size={16} className="mr-2" />
                  <span>Start Date: {new Date(scheme.startDate).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Calendar size={16} className="mr-2" />
                  <span>End Date: {new Date(scheme.endDate).toLocaleDateString()}</span>
                </div>
              </div>
              
              <Separator />
              
              <div>
                <h3 className="font-semibold mb-2">Beneficiaries</h3>
                <div className="flex items-center text-sm text-gray-600">
                  <Users size={16} className="mr-2" />
                  <span>5,000+ citizens have benefited</span>
                </div>
              </div>
              
              <Separator />
              
              <div className="space-y-4">
                <h3 className="font-semibold">Apply for this Scheme</h3>
                {scheme.status === 'active' ? (
                  <Button 
                    className="w-full" 
                    onClick={handleApply}
                  >
                    {isLoggedIn ? 'Apply Now' : 'Login to Apply'}
                  </Button>
                ) : scheme.status === 'upcoming' ? (
                  <Button className="w-full" disabled>
                    Coming Soon
                  </Button>
                ) : (
                  <Button className="w-full" disabled>
                    Applications Closed
                  </Button>
                )}
              </div>
              
              <Separator />
              
              <div className="space-y-3">
                <h3 className="font-semibold">Resources</h3>
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => window.open('#', '_blank')}
                >
                  <Download size={16} className="mr-2" />
                  Scheme Guidelines (PDF)
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => window.open('#', '_blank')}
                >
                  <ExternalLink size={16} className="mr-2" />
                  Official Government Portal
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => window.open('#', '_blank')}
                >
                  <FileText size={16} className="mr-2" />
                  FAQ Document
                </Button>
              </div>
              
              <Separator />
              
              <div>
                <h3 className="font-semibold mb-2">Need Help?</h3>
                <p className="text-sm text-gray-600 mb-3">
                  Contact our support team for assistance with this scheme.
                </p>
                <Button variant="outline" className="w-full">
                  Contact Support
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SchemeDetail;
