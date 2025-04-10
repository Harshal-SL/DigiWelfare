
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { LogIn, Menu, X, UserPlus, User } from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";

export const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { isLoggedIn, logout, user } = useAuth();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="w-full py-4 px-4 md:px-8 bg-white shadow-sm">
      <div className="container mx-auto">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-2" onClick={() => navigate("/")} style={{ cursor: "pointer" }}>
            <div className="bg-welfare-500 text-white p-2 rounded-md">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <span className="font-bold text-xl text-welfare-700">AidLedger</span>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex md:items-center md:space-x-8">
            <a href="/" className="text-welfare-700 hover:text-welfare-500 font-medium">Home</a>
            <a href="/schemes" className="text-welfare-700 hover:text-welfare-500 font-medium">Schemes</a>
            <a href="/about" className="text-welfare-700 hover:text-welfare-500 font-medium">About</a>
            {isLoggedIn ? (
              <div className="flex items-center gap-4">
                <Button 
                  variant="ghost" 
                  onClick={() => {
                    if (user?.role === 'admin') {
                      navigate("/admin");
                    } else {
                      navigate("/dashboard");
                    }
                  }}
                >
                  {user?.role === 'admin' ? 'Admin Panel' : 'Dashboard'}
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => navigate("/profile")}
                  className="flex items-center gap-2"
                >
                  <User size={16} />
                  Profile
                </Button>
                <Button onClick={logout} variant="outline">Logout</Button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Button onClick={() => navigate("/register")} variant="outline" className="flex items-center gap-2">
                  <UserPlus size={18} />
                  Register
                </Button>
                <Button onClick={() => navigate("/login")} className="flex items-center gap-2">
                  <LogIn size={18} />
                  Login
                </Button>
              </div>
            )}
          </nav>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button 
              onClick={toggleMenu} 
              className="text-welfare-700 hover:text-welfare-500 focus:outline-none"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <nav className="md:hidden mt-4 flex flex-col space-y-4 py-4">
            <a href="/" className="text-welfare-700 hover:text-welfare-500 font-medium py-2">Home</a>
            <a href="/schemes" className="text-welfare-700 hover:text-welfare-500 font-medium py-2">Schemes</a>
            <a href="/about" className="text-welfare-700 hover:text-welfare-500 font-medium py-2">About</a>
            {isLoggedIn ? (
              <>
                <Button 
                  variant="ghost"
                  className="justify-start"
                  onClick={() => {
                    if (user?.role === 'admin') {
                      navigate("/admin");
                    } else {
                      navigate("/dashboard");
                    }
                    setIsMenuOpen(false);
                  }}
                >
                  {user?.role === 'admin' ? 'Admin Panel' : 'Dashboard'}
                </Button>
                <Button 
                  variant="outline"
                  className="justify-start"
                  onClick={() => {
                    navigate("/profile");
                    setIsMenuOpen(false);
                  }}
                >
                  <User size={16} className="mr-2" />
                  Profile
                </Button>
                <Button onClick={() => {logout(); setIsMenuOpen(false);}} variant="outline">Logout</Button>
              </>
            ) : (
              <>
                <Button 
                  onClick={() => {navigate("/register"); setIsMenuOpen(false);}} 
                  variant="outline"
                  className="flex items-center gap-2 justify-start"
                >
                  <UserPlus size={18} />
                  Register
                </Button>
                <Button onClick={() => {navigate("/login"); setIsMenuOpen(false);}} className="flex items-center gap-2">
                  <LogIn size={18} />
                  Login
                </Button>
              </>
            )}
          </nav>
        )}
      </div>
    </header>
  );
};
