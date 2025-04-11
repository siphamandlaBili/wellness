import { useState } from "react";
import { Link } from "react-router-dom"; // Use Link to handle routing
import { Menu, X } from "lucide-react";
import { useNavigate } from "react-router-dom"; // Import useNavigate for navigation
import { useLocation } from "react-router-dom"; // Import useLocation to get the current path

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation(); // Get the current path
  const currentPath = location.pathname; // Get the current path from location

  const showMiddleNav = () => {
    if (currentPath !== "/") {
      return false; // Don't show middle nav if not on the landing page
    }
    return true; // Show middle nav if on the landing page
  }
  return (
    <nav className="bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 p-4 shadow-md">
  <div className="flex items-center justify-between">
    {/* Left Section */}
    <div className="flex items-center gap-4">
      <span className="text-xl font-semibold text-[rgb(153,39,135)] dark:text-purple-400">
        FMP WELLENESS
      </span>
    </div>

    {/* Burger Menu Button */}
    {showMiddleNav() && (
      <div className="md:hidden">
        <button 
          onClick={() => setIsOpen(!isOpen)} 
          className="text-gray-900 dark:text-gray-100 hover:text-[rgb(153,39,135)] dark:hover:text-purple-300"
        >
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>
    )}

    {/* Middle Navigation */}
    {showMiddleNav() && (
      <div className="hidden md:flex items-center gap-6">
        <a 
          href="#about" 
          className="text-gray-600 dark:text-gray-300 text-lg hover:text-[rgb(153,39,135)] dark:hover:text-purple-300 transition-colors"
          onClick={() => setIsOpen(false)}
        >
          About
        </a>
        <a 
          href="#FAQ" 
          className="text-gray-600 dark:text-gray-300 text-lg hover:text-[rgb(153,39,135)] dark:hover:text-purple-300 transition-colors"
          onClick={() => setIsOpen(false)}
        >
          FAQ
        </a>
      </div>
    )}

    {/* Right Section */}
    {showMiddleNav() && (
      <button
        className="hidden md:flex text-md text-gray-500 dark:text-gray-300 hover:text-[rgb(153,39,135)] dark:hover:text-purple-300 transition-colors cursor-pointer"
        onClick={() => navigate('/login')}
      >
        Login
      </button>
    )}
  </div>

  {/* Mobile Menu */}
  {(isOpen && showMiddleNav()) && (
    <div className="md:hidden flex flex-col items-center gap-4 mt-4 dark:bg-gray-800">
      <a 
        href="#about" 
        className="text-gray-600 dark:text-gray-300 text-lg hover:text-[rgb(153,39,135)] dark:hover:text-purple-300 transition-colors"
        onClick={() => setIsOpen(false)}
      >
        About
      </a>
      <a 
        href="#FAQ" 
        className="text-gray-600 dark:text-gray-300 text-lg hover:text-[rgb(153,39,135)] dark:hover:text-purple-300 transition-colors"
        onClick={() => setIsOpen(false)}
      >
        FAQ
      </a>
      <button
        className="text-gray-500 dark:text-gray-300 hover:text-[rgb(153,39,135)] dark:hover:text-purple-300 transition-colors cursor-pointer"
        onClick={() => {
          setIsOpen(false)
          navigate('/login')
        }}
      >
        Login
      </button>
    </div>
  )}
</nav>
  );
};

export default Navbar;
