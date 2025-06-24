import { Button } from "@/components/ui/button";
<<<<<<< HEAD
import { ArrowRight, CheckCircle, Lock, Shield, User } from "lucide-react";
=======
import {
  ArrowRight,
  CheckCircle,
  Lock,
  Shield,
  MessageSquare,
  FileCheck,
  UserCheck,
} from "lucide-react";
>>>>>>> d7647d5 (Your detailed commit message here)
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { schemes } from "@/data/mockData";
import { useEffect, useState } from "react";

const HomePage = () => {
  const navigate = useNavigate();
  const { isLoggedIn } = useAuth();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const carouselImages = [
    "https://images.unsplash.com/photo-1551434678-e076c223a692?q=80&w=800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?q=80&w=800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1600880292089-90a7e086ee0c?q=80&w=800&auto=format&fit=crop"
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % carouselImages.length);
    }, 5000); // Change image every 5 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
<<<<<<< HEAD
      {/* Hero Section with Carousel */}
      <section className="relative h-[600px] overflow-hidden">
        {/* Carousel Images */}
        <div className="absolute inset-0">
          {carouselImages.map((image, index) => (
            <div
              key={index}
              className={`absolute inset-0 transition-opacity duration-1000 ${
                index === currentImageIndex ? 'opacity-100' : 'opacity-0'
              }`}
            >
              <img
                src={image}
                alt={`Slide ${index + 1}`}
                className="w-full h-full object-cover"
=======
      {/* Hero Section */}
      <section className="bg-white text-gray-800 py-20">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="md:w-full">
              <h1 className="text-4xl md:text-5xl font-extrabold mb-4 leading-tight">
                Empowering Lives Through Secure Welfare
              </h1>
              <p className="text-lg md:text-xl text-gray-600 mb-8">
                Experience a new era of social welfare distribution, powered by AI and Blockchain for complete transparency and security.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  size="lg" 
                  className="bg-welfare-500 text-white hover:bg-welfare-600 shadow-lg transform hover:scale-105 transition-transform"
                  onClick={() => navigate(isLoggedIn ? "/dashboard" : "/login")}
                >
                  {isLoggedIn ? "Go to Your Dashboard" : "Get Started"}
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="border-welfare-500 text-welfare-500 hover:bg-welfare-50 hover:text-welfare-600"
                  onClick={() => navigate("/schemes")}
                >
                  Explore Schemes
                </Button>
              </div>
            </div>
            <div className="md:w-full">
              <img 
                src="https://images.unsplash.com/photo-1593113598332-cd288d649433?q=80&w=1470&auto=format&fit=crop" 
                alt="Community and support" 
                className="rounded-xl shadow-2xl w-full h-auto"
>>>>>>> d7647d5 (Your detailed commit message here)
              />
            </div>
          ))}
        </div>

        {/* Semi-transparent overlay */}
        <div className="absolute inset-0 bg-black/50" />

        {/* Content */}
        <div className="relative container mx-auto px-4 h-full flex items-center">
          <div className="max-w-2xl text-white">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Transparent & Efficient Social Welfare Distribution
            </h1>
            <p className="text-lg md:text-xl mb-8">
              DigiWelfare: An Aadhaar-integrated welfare platform leveraging AI & Blockchain for secure, transparent, and efficient scheme distribution.
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
                className="border-white text-[#0f698a] hover:bg-transparent"
                onClick={() => navigate("/schemes")}
              >
                View All Schemes
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">How DigiWelfare Works</h2>
          
          <div className="grid md:grid-cols-4 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="flex justify-center mb-4">
                <Shield className="h-12 w-12 text-welfare-500" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Secure Authentication</h3>
              <p className="text-gray-600">Log in securely using your Aadhaar via DigiLocker integration, ensuring your identity is protected.</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="flex justify-center mb-4">
                <CheckCircle className="h-12 w-12 text-welfare-500" />
              </div>
              <h3 className="text-xl font-semibold mb-3">AI-Powered Eligibility</h3>
              <p className="text-gray-600">Our AI system automatically checks your eligibility for various welfare schemes, making recommendations based on your profile.</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="flex justify-center mb-4">
                <Lock className="h-12 w-12 text-welfare-500" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Blockchain Verification</h3>
              <p className="text-gray-600">All disbursements are recorded on a blockchain ledger, ensuring complete transparency and preventing fraud.</p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="flex justify-center mb-4">
                <User className="h-12 w-12 text-welfare-500" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Build Your Profile</h3>
              <p className="text-gray-600">Create and manage your digital profile with verified documents, making it easier to apply for multiple schemes.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Why Choose DigiWelfare?</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <MessageSquare className="h-12 w-12 text-welfare-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">AI Chatbot</h3>
              <p className="text-gray-600">Get instant answers to your questions about schemes and application processes.</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <FileCheck className="h-12 w-12 text-welfare-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Secure Document Verification</h3>
              <p className="text-gray-600">Verify your documents securely with our DigiLocker integration.</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <UserCheck className="h-12 w-12 text-welfare-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Automated Eligibility Check</h3>
              <p className="text-gray-600">Our AI automatically checks your eligibility for various schemes.</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <Lock className="h-12 w-12 text-welfare-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Transparent Transactions</h3>
              <p className="text-gray-600">All transactions are recorded on the blockchain for full transparency.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Get Started Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Get Started in 3 Easy Steps</h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="p-6">
              <div className="flex items-center justify-center h-16 w-16 bg-welfare-500 text-white rounded-full mx-auto mb-4">
                <span className="text-2xl font-bold">1</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Create an Account</h3>
              <p className="text-gray-600">Register on our platform using your basic details.</p>
            </div>
            <div className="p-6">
              <div className="flex items-center justify-center h-16 w-16 bg-welfare-500 text-white rounded-full mx-auto mb-4">
                <span className="text-2xl font-bold">2</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Verify with DigiLocker</h3>
              <p className="text-gray-600">Complete your profile by verifying your documents with DigiLocker.</p>
            </div>
            <div className="p-6">
              <div className="flex items-center justify-center h-16 w-16 bg-welfare-500 text-white rounded-full mx-auto mb-4">
                <span className="text-2xl font-bold">3</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Apply for Schemes</h3>
              <p className="text-gray-600">Browse and apply for schemes you are eligible for.</p>
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
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {schemes.slice(0, 4).map((scheme) => (
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
                <p className="text-gray-600 mb-4 h-24 overflow-hidden">
                  {scheme.description}
                </p>
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
