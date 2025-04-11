import { useState } from "react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { 
  Calendar,
  CheckCircle2, 
  FileText, 
  Search, 
  SlidersHorizontal 
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { schemes, Scheme } from "@/data/mockData";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";

const SchemesPage = () => {
  const navigate = useNavigate();
  const { isLoggedIn } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [sortOrder, setSortOrder] = useState<string>("latest");

  // Filter schemes based on search term and status
  const filteredSchemes = schemes.filter((scheme) => {
    const matchesSearch = 
      scheme.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      scheme.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = 
      statusFilter === "all" || scheme.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  // Sort schemes based on sort order
  const sortedSchemes = [...filteredSchemes].sort((a, b) => {
    if (sortOrder === "latest") {
      return new Date(b.startDate).getTime() - new Date(a.startDate).getTime();
    } else if (sortOrder === "oldest") {
      return new Date(a.startDate).getTime() - new Date(b.startDate).getTime();
    } else if (sortOrder === "alphabetical") {
      return a.title.localeCompare(b.title);
    }
    return 0;
  });

  return (
    <div className="container mx-auto py-8 px-4">
      {/* Header */}
      <div className="text-center mb-10">
        <h1 className="text-3xl md:text-4xl font-bold mb-4">Government Welfare Schemes</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Explore various welfare schemes offered by the government and check your eligibility. Apply online through our secure platform.
        </p>
      </div>

      {/* Search and Filters */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <Input 
              placeholder="Search for schemes..." 
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="flex gap-4">
            <Select
              value={statusFilter}
              onValueChange={setStatusFilter}
            >
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="upcoming">Upcoming</SelectItem>
                <SelectItem value="closed">Closed</SelectItem>
              </SelectContent>
            </Select>
            
            <Select
              value={sortOrder}
              onValueChange={setSortOrder}
            >
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="latest">Latest First</SelectItem>
                <SelectItem value="oldest">Oldest First</SelectItem>
                <SelectItem value="alphabetical">A to Z</SelectItem>
              </SelectContent>
            </Select>
            
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" size="icon">
                  <SlidersHorizontal size={18} />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80">
                <div className="space-y-4">
                  <h3 className="font-medium">Advanced Filters</h3>
                  <div className="space-y-2">
                    <p className="text-sm font-medium">Income Category</p>
                    <div className="flex flex-wrap gap-2">
                      <Button size="sm" variant="outline" className="text-xs">Below ₹3 lakh</Button>
                      <Button size="sm" variant="outline" className="text-xs">₹3-5 lakh</Button>
                      <Button size="sm" variant="outline" className="text-xs">₹5-8 lakh</Button>
                      <Button size="sm" variant="outline" className="text-xs">Above ₹8 lakh</Button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm font-medium">Category</p>
                    <div className="flex flex-wrap gap-2">
                      <Button size="sm" variant="outline" className="text-xs">Education</Button>
                      <Button size="sm" variant="outline" className="text-xs">Housing</Button>
                      <Button size="sm" variant="outline" className="text-xs">Agriculture</Button>
                      <Button size="sm" variant="outline" className="text-xs">Healthcare</Button>
                    </div>
                  </div>
                  <div className="pt-2 flex justify-between">
                    <Button variant="outline" size="sm">Reset</Button>
                    <Button size="sm">Apply Filters</Button>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          </div>
        </div>
      </div>

      {/* Schemes List */}
      {sortedSchemes.length > 0 ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedSchemes.map((scheme) => (
            <SchemeCard 
              key={scheme.id} 
              scheme={scheme} 
              navigate={navigate}
              isLoggedIn={isLoggedIn}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <FileText className="mx-auto h-12 w-12 text-gray-400 mb-3" />
          <h3 className="text-lg font-medium text-gray-900 mb-1">No Schemes Found</h3>
          <p className="text-gray-600 mb-4">Try adjusting your search or filters.</p>
          <Button 
            variant="outline"
            onClick={() => {
              setSearchTerm("");
              setStatusFilter("all");
            }}
          >
            Clear Filters
          </Button>
        </div>
      )}
    </div>
  );
};

// Scheme Card Component
const SchemeCard = ({ 
  scheme, 
  navigate,
  isLoggedIn
}: { 
  scheme: Scheme; 
  navigate: (path: string) => void;
  isLoggedIn: boolean;
}) => {
  return (
    <div className="scheme-card flex flex-col h-full">
      <div className="relative h-48 mb-4 overflow-hidden rounded-md">
        <img 
          src={scheme.thumbnail} 
          alt={scheme.title} 
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
        />
        <div className="absolute top-3 right-3">
          <span className={`
            px-3 py-1 rounded-full text-xs font-medium
            ${scheme.status === 'active' ? 'bg-green-100 text-green-800' : 
              scheme.status === 'upcoming' ? 'bg-blue-100 text-blue-800' : 
              'bg-gray-100 text-gray-800'}
          `}>
            {scheme.status === 'active' ? 'Active' : 
              scheme.status === 'upcoming' ? 'Upcoming' : 'Closed'}
          </span>
        </div>
      </div>
      
      <h3 className="text-xl font-semibold mb-2">{scheme.title}</h3>
      <p className="text-gray-600 mb-4 flex-grow">{scheme.description}</p>
      
      <div className="mt-auto space-y-4">
        <div className="flex items-center text-sm text-gray-500">
          <Calendar size={16} className="mr-2" />
          <span>
            {new Date(scheme.startDate).toLocaleDateString()} - {new Date(scheme.endDate).toLocaleDateString()}
          </span>
        </div>
        
        <div className="flex flex-wrap gap-2 mb-4">
          {scheme.eligibility.slice(0, 2).map((item, index) => (
            <div key={index} className="flex items-center text-xs text-green-700 bg-green-50 px-2 py-1 rounded-full">
              <CheckCircle2 size={12} className="mr-1" />
              {item}
            </div>
          ))}
          {scheme.eligibility.length > 2 && (
            <div className="text-xs text-[#0f698a] bg-[#0f698a]/10 px-2 py-1 rounded-full">
              +{scheme.eligibility.length - 2} more
            </div>
          )}
        </div>
        
        <div className="flex gap-3">
          <Button 
            className="flex-1"
            onClick={() => navigate(`/schemes/${scheme.id}`)}
            variant={scheme.status === 'active' ? 'default' : 'outline'}
            disabled={scheme.status !== 'active'}
          >
            {scheme.status === 'active' ? 
              (isLoggedIn ? 'Apply Now' : 'Login to Apply') : 
              (scheme.status === 'upcoming' ? 'Coming Soon' : 'Closed')}
          </Button>
          <Button 
            variant="outline"
            onClick={() => navigate(`/schemes/${scheme.id}`)}
          >
            Details
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SchemesPage;
