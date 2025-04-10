
import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle, Lock, Shield } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { schemes } from "@/data/mockData";

const HomePage = () => {
  const navigate = useNavigate();
  const { isLoggedIn } = useAuth();

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="gradient-bg text-white py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-12">
            <div className="md:w-1/2">
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                Transparent & Efficient Social Welfare Distribution
              </h1>
              <p className="text-lg md:text-xl mb-8">
                AidLedger uses AI and blockchain technology to ensure that social welfare benefits reach the right people at the right time, with complete transparency and security.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  size="lg" 
                  className="bg-white text-welfare-700 hover:bg-gray-100"
                  onClick={() => navigate(isLoggedIn ? "/dashboard" : "/login")}
                >
                  {isLoggedIn ? "Go to Dashboard" : "Login to Apply"}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="border-white text-white hover:bg-welfare-600"
                  onClick={() => navigate("/schemes")}
                >
                  View All Schemes
                </Button>
              </div>
            </div>
            <div className="md:w-1/2">
              <img 
                src="https://images.unsplash.com/photo-1604076913837-52ab5629fba9?q=80&w=800&auto=format&fit=crop" 
                alt="People receiving benefits" 
                className="rounded-lg shadow-xl max-w-full h-auto"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">How AidLedger Works</h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex justify-center mb-4">
                <Shield className="h-12 w-12 text-welfare-500" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-center">Secure Authentication</h3>
              <p className="text-gray-600">Log in securely using your Aadhaar via DigiLocker integration, ensuring your identity is protected.</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex justify-center mb-4">
                <CheckCircle className="h-12 w-12 text-welfare-500" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-center">AI-Powered Eligibility</h3>
              <p className="text-gray-600">Our AI system automatically checks your eligibility for various welfare schemes, making recommendations based on your profile.</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex justify-center mb-4">
                <Lock className="h-12 w-12 text-welfare-500" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-center">Blockchain Verification</h3>
              <p className="text-gray-600">All disbursements are recorded on a blockchain ledger, ensuring complete transparency and preventing fraud.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Schemes */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-10">
            <h2 className="text-3xl font-bold">Featured Schemes</h2>
            <Button 
              variant="outline" 
              onClick={() => navigate("/schemes")}
              className="flex items-center"
            >
              View All
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {schemes.slice(0, 3).map((scheme) => (
              <div key={scheme.id} className="scheme-card">
                <div className="relative h-48 mb-4 overflow-hidden rounded-md">
                  <img 
                    src={scheme.thumbnail} 
                    alt={scheme.title} 
                    className="w-full h-full object-cover"
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
                <p className="text-gray-600 mb-4">{scheme.description}</p>
                <Button 
                  className="w-full"
                  onClick={() => navigate(`/schemes/${scheme.id}`)}
                >
                  View Details
                </Button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials or Stats */}
      <section className="gradient-bg text-white py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Making an Impact</h2>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <p className="text-4xl font-bold mb-2">10M+</p>
              <p className="text-lg">Beneficiaries</p>
            </div>
            <div>
              <p className="text-4xl font-bold mb-2">₹500Cr</p>
              <p className="text-lg">Disbursed</p>
            </div>
            <div>
              <p className="text-4xl font-bold mb-2">99.8%</p>
              <p className="text-lg">Accuracy</p>
            </div>
            <div>
              <p className="text-4xl font-bold mb-2">24/7</p>
              <p className="text-lg">Support</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Access Government Schemes?</h2>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            Log in with your Aadhaar to explore all the welfare schemes you're eligible for and apply seamlessly.
          </p>
          <Button 
            size="lg" 
            onClick={() => navigate(isLoggedIn ? "/dashboard" : "/login")}
          >
            {isLoggedIn ? "Go to Dashboard" : "Get Started Now"}
          </Button>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
