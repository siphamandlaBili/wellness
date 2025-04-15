import React from 'react';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';

const Hero = () => {
  const navigate = useNavigate();
  
  return (
    <>
      <ToastContainer theme="colored" />
      <div className="relative h-[90vh] w-full bg-cover bg-center" 
        style={{
          backgroundImage:
            "url('https://jacoblund.com/cdn/shop/files/fd511ddebad5b6d84208b93defe69eb2.jpg?v=1720609826')",
        }}
      >
        {/* Overlay Cover */}
        <div className="absolute inset-0 bg-[#93456559]"></div>

        {/* Content */}
        <div className="relative z-10 flex flex-col items-center justify-center h-full px-4 text-center text-white max-w-4xl mx-auto">
          <h1 className="text-4xl sm:text-6xl font-bold mb-6 leading-tight">
            Discover Your Wellness Journey
          </h1>
          <p className="text-lg sm:text-xl text-gray-200 mb-8">
            Connecting Mind, Body, and Spirit for a Happier You
          </p>
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <button
              className="bg-[rgb(153,39,135)] hover:bg-[rgb(130,30,115)] text-white font-semibold px-6 py-3 rounded-lg shadow-md transition"
              onClick={() => {
                toast.success("You need to login before booking...");
                setTimeout(() => {
                  navigate("/login");
                }, 1000);
              }}
            >
              Book A Wellness Event
            </button>
            <a
              href="#"
              className="text-sm font-semibold text-[rgb(255,255,255)] hover:underline"
            >
              Learn More Wellness Event →
            </a>
          </div>
        </div>
      </div>
    </>
  );
};

export default Hero;
