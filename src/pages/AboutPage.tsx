import { 
  Award,
  Clock,
  Database,
  Lock,
  Shield,
  UserCheck
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const AboutPage = () => {
  const navigate = useNavigate();
  
  return (
    <div className="container mx-auto py-8 px-4">
      {/* Hero Section */}
      <section className="text-center mb-16">
<<<<<<< HEAD
        <div className="bg-[#0f698a] text-white p-8 rounded-lg">
          <h1 className="text-4xl font-bold mb-6">About DigiWelfare</h1>
          <p className="text-xl max-w-3xl mx-auto">
            Seamless Welfare Distribution. Trusted, Transparent, AI-Driven.
          </p>
        </div>
=======
        <h1 className="text-4xl font-bold mb-6">About digiwelfare</h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Leveraging AI and blockchain for a transparent, efficient, and secure social welfare system.
        </p>
>>>>>>> d7647d5 (Your detailed commit message here)
      </section>

      {/* Mission & Vision */}
      <section className="mb-16">
        <div className="grid md:grid-cols-2 gap-12">
          <div className="bg-white p-8 rounded-lg shadow-sm border">
            <h2 className="text-2xl font-bold mb-4 text-welfare-700">Our Mission</h2>
            <p className="text-gray-700 mb-6">
              To create a transparent, efficient, and secure platform that ensures social welfare benefits reach the right beneficiaries, eliminates leakages, and empowers citizens through technology.
            </p>
            <div className="flex items-center text-welfare-600">
              <Award className="mr-2" size={20} />
              <span className="font-medium">Empowering through innovation</span>
            </div>
          </div>
          
          <div className="bg-white p-8 rounded-lg shadow-sm border">
            <h2 className="text-2xl font-bold mb-4 text-welfare-700">Our Vision</h2>
            <p className="text-gray-700 mb-6">
              A world where every eligible citizen has seamless access to welfare schemes, with complete transparency in the distribution process and zero fraud or misallocation of resources.
            </p>
            <div className="flex items-center text-welfare-600">
              <UserCheck className="mr-2" size={20} />
              <span className="font-medium">100% benefit delivery accuracy</span>
            </div>
          </div>
        </div>
      </section>

      {/* Technology Platform */}
      <section className="mb-16">
        <h2 className="text-3xl font-bold mb-8 text-center">Our Technology Platform</h2>
        
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-lg shadow-sm border text-center">
            <div className="bg-welfare-50 p-4 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <Shield className="text-welfare-600" size={24} />
            </div>
            <h3 className="text-xl font-semibold mb-3">Secure Authentication</h3>
            <p className="text-gray-600">
              Integrated with DigiLocker for Aadhaar-based verification, ensuring secure and authentic user identity.
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm border text-center">
            <div className="bg-welfare-50 p-4 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <Database className="text-welfare-600" size={24} />
            </div>
            <h3 className="text-xl font-semibold mb-3">AI-Powered Processing</h3>
            <p className="text-gray-600">
              Advanced algorithms assess eligibility, detect fraud, and ensure compliance with scheme guidelines.
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm border text-center">
            <div className="bg-welfare-50 p-4 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <Lock className="text-welfare-600" size={24} />
            </div>
            <h3 className="text-xl font-semibold mb-3">Blockchain Ledger</h3>
            <p className="text-gray-600">
              Every transaction is recorded on a secure blockchain, creating an immutable record for complete transparency.
            </p>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="gradient-bg text-white py-16 px-4 rounded-xl mb-16">
<<<<<<< HEAD
        <h2 className="text-3xl font-bold mb-12 text-center">How DigiWelfare Works</h2>
=======
        <h2 className="text-3xl font-bold mb-12 text-center">How digiwelfare Works</h2>
>>>>>>> d7647d5 (Your detailed commit message here)
        
        <div className="max-w-4xl mx-auto">
          <div className="space-y-12">
            <div className="flex flex-col md:flex-row gap-6 items-start">
              <div className="bg-white/10 p-4 rounded-full w-16 h-16 flex items-center justify-center shrink-0 md:mt-0">
                <span className="text-2xl font-bold">1</span>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">User Authentication</h3>
                <p className="text-gray-100">
                  Citizens log in securely using their Aadhaar credentials through DigiLocker integration. This ensures that only genuine, eligible individuals can apply for welfare schemes.
                </p>
              </div>
            </div>
            
            <div className="flex flex-col md:flex-row gap-6 items-start">
              <div className="bg-white/10 p-4 rounded-full w-16 h-16 flex items-center justify-center shrink-0 md:mt-0">
                <span className="text-2xl font-bold">2</span>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Application & Document Submission</h3>
                <p className="text-gray-100">
                  Users can browse available schemes, check eligibility, and apply by submitting the required information and documents. The platform simplifies the process with intuitive forms and document uploaders.
                </p>
              </div>
            </div>
            
            <div className="flex flex-col md:flex-row gap-6 items-start">
              <div className="bg-white/10 p-4 rounded-full w-16 h-16 flex items-center justify-center shrink-0 md:mt-0">
                <span className="text-2xl font-bold">3</span>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">AI Verification & Processing</h3>
                <p className="text-gray-100">
                  Our AI system validates the application against scheme criteria and checks for potential fraud. It assigns an eligibility score to assist administrators in reviewing applications.
                </p>
              </div>
            </div>
            
            <div className="flex flex-col md:flex-row gap-6 items-start">
              <div className="bg-white/10 p-4 rounded-full w-16 h-16 flex items-center justify-center shrink-0 md:mt-0">
                <span className="text-2xl font-bold">4</span>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Approval & Blockchain Recording</h3>
                <p className="text-gray-100">
                  Approved applications are recorded on the blockchain with a unique transaction hash. This creates a permanent, tamper-proof record of the disbursement, ensuring complete transparency.
                </p>
              </div>
            </div>
            
            <div className="flex flex-col md:flex-row gap-6 items-start">
              <div className="bg-white/10 p-4 rounded-full w-16 h-16 flex items-center justify-center shrink-0 md:mt-0">
                <span className="text-2xl font-bold">5</span>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Benefit Disbursement & Tracking</h3>
                <p className="text-gray-100">
                  Benefits are disbursed to the beneficiary's registered account. Users can track their application status and disbursement history through their dashboard.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits/Key Features */}
      <section className="mb-16">
        <h2 className="text-3xl font-bold mb-8 text-center">Key Benefits</h2>
        
        <div className="grid md:grid-cols-2 gap-8">
          <div className="flex gap-4">
            <div className="bg-welfare-50 p-3 rounded-md h-fit">
              <Clock className="text-welfare-600" size={24} />
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-2">Efficient Processing</h3>
              <p className="text-gray-600">
                Reduces application processing time from weeks to days, with automated verification and streamlined workflows.
              </p>
            </div>
          </div>
          
          <div className="flex gap-4">
            <div className="bg-welfare-50 p-3 rounded-md h-fit">
              <Shield className="text-welfare-600" size={24} />
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-2">Enhanced Security</h3>
              <p className="text-gray-600">
                Multi-layer security architecture with Aadhaar verification and blockchain ensures data privacy and prevents unauthorized access.
              </p>
            </div>
          </div>
          
          <div className="flex gap-4">
            <div className="bg-welfare-50 p-3 rounded-md h-fit">
              <Database className="text-welfare-600" size={24} />
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-2">Complete Transparency</h3>
              <p className="text-gray-600">
                Every transaction is recorded on the blockchain, creating an immutable audit trail accessible to authorized stakeholders.
              </p>
            </div>
          </div>
          
          <div className="flex gap-4">
            <div className="bg-welfare-50 p-3 rounded-md h-fit">
              <UserCheck className="text-welfare-600" size={24} />
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-2">Fraud Prevention</h3>
              <p className="text-gray-600">
                AI-powered systems detect potential fraud patterns, duplicate applications, and eligibility discrepancies in real-time.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-welfare-50 p-8 md:p-12 rounded-xl text-center">
<<<<<<< HEAD
        <h2 className="text-2xl font-bold mb-4">Ready to Experience DigiWelfare?</h2>
=======
        <h2 className="text-2xl font-bold mb-4">Ready to Experience digiwelfare?</h2>
>>>>>>> d7647d5 (Your detailed commit message here)
        <p className="text-gray-700 mb-8 max-w-2xl mx-auto">
          Join us in our mission to create a fair and transparent welfare system for all. Check your eligibility for various government schemes today.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button 
            size="lg"
            onClick={() => navigate("/schemes")}
          >
            Explore Schemes
          </Button>
          <Button 
            variant="outline" 
            size="lg"
            onClick={() => navigate("/login")}
          >
            Login to Apply
          </Button>
        </div>
      </section>

      {/* Government Welfare Schemes Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="bg-[#0f698a] p-8 rounded-lg">
            <h2 className="text-3xl font-bold mb-6 text-white">Government Welfare Schemes</h2>
            <p className="text-xl text-white max-w-3xl">
              Explore various welfare schemes offered by the government and check your eligibility. Apply online through our secure platform.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;
