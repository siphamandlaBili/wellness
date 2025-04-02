import { useState } from "react";
import { Link } from "react-router-dom"; // Use Link to handle routing
import { Menu, X } from "lucide-react";
import { useNavigate } from "react-router-dom"; // Import useNavigate for navigation
import { useLocation } from "react-router-dom"; // Import useLocation to get the current path

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate =  useNavigate();
  const location = useLocation(); // Get the current path
  const currentPath = location.pathname; // Get the current path from location
  
  const showMiddleNav = () => {
    if(currentPath !== "/") {
      return false; // Don't show middle nav if not on the landing page
    }
    return true; // Show middle nav if on the landing page
  }
  return (
    <nav className="bg-white text-gray-900 p-4 shadow-md">
      <div className="flex items-center justify-between">
        {/* Left Section */}
        <div className="flex items-center gap-4">
          <span className="text-xl font-semibold text-[rgb(153,39,135)]">Wellness</span>
        </div>

        {/* Burger Menu Button */}
        {showMiddleNav() && (<div className="md:hidden">
          <button onClick={() => setIsOpen(!isOpen)} className="text-gray-900">
            {isOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>)}
        

        {/* Middle Navigation */}
        {showMiddleNav() && (<div className="hidden md:flex items-center gap-6">
          <Link to="about" className="relative text-gray-600 text-lg hover:text-[rgb(153,39,135)] group">
            About
          </Link>
          <Link to="/projects" className="relative text-gray-600 text-lg hover:text-[rgb(153,39,135)] group">
            Projects
          </Link>
          <Link to="/calendar" className="relative text-gray-600 text-lg hover:text-[rgb(153,39,135)] group">
            Calendar
          </Link>
        </div>)}
        

        {/* Right Section */}
        <div className="hidden md:flex items-center gap-4">
        </div>
      </div>

      {/* Mobile Menu */}
      {(isOpen && showMiddleNav()) && (
        <div className="md:hidden flex flex-col items-center gap-4 mt-4">
          <Link to="#about" className="text-gray-600 text-lg hover:text-[rgb(153,39,135)]" onClick={() => setIsOpen(false)}>
            About
          </Link>
          <Link to="/projects" className="text-gray-600 text-lg hover:text-[rgb(153,39,135)]" onClick={() => setIsOpen(false)}>
            Projects
          </Link>
          <Link to="/calendar" className="text-gray-600 text-lg hover:text-[rgb(153,39,135)]" onClick={() => setIsOpen(false)}>
            Calendar
          </Link>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
