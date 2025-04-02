import { useState } from "react";
import { Link } from "react-router-dom"; // Use Link to handle routing
import { Menu, X } from "lucide-react";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState({
    isAuthenticated: false, // Change this dynamically based on login state
    name: "Siphamandla",
  });

  return (
    <nav className="bg-white text-gray-900 p-4 shadow-md">
      <div className="flex items-center justify-between">
        {/* Left Section */}
        <div className="flex items-center gap-4">
          <span className="text-xl font-semibold text-[rgb(153,39,135)]">Wellness</span>
        </div>

        {/* Burger Menu Button */}
        <div className="md:hidden">
          <button onClick={() => setIsOpen(!isOpen)} className="text-gray-900">
            {isOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>

        {/* Middle Navigation */}
        <div className="hidden md:flex items-center gap-6">
          <Link to="about" className="relative text-gray-600 text-lg hover:text-[rgb(153,39,135)] group">
            About
          </Link>
          <Link to="/projects" className="relative text-gray-600 text-lg hover:text-[rgb(153,39,135)] group">
            Projects
          </Link>
          <Link to="/calendar" className="relative text-gray-600 text-lg hover:text-[rgb(153,39,135)] group">
            Calendar
          </Link>
        </div>

        {/* Right Section */}
        <div className="hidden md:flex items-center gap-4">
          {/* Add Link to the Login Page */}
          <Link 
            to="/login" 
            className="bg-[rgb(153,39,135)] hover:bg-[rgb(130,30,115)] text-white px-4 py-1.5 rounded-lg"
          >
            Login
          </Link>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
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

          {/* Mobile login button */}
          <Link 
            to="/login" 
            className="bg-[rgb(153,39,135)] hover:bg-[rgb(130,30,115)] text-white px-4 py-1.5 rounded-lg" 
            onClick={() => setIsOpen(false)}
          >
            Login
          </Link>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
