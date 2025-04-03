import React,{useState} from 'react';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';

const Hero = () => {
 
    const navigate = useNavigate();
    
  return (
    <>
    <ToastContainer/>
      {/* Top Blurred Background */}
      <div
        aria-hidden="true"
        className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80"
      ></div>

      {/* Main Hero Content */}
      <div className="max-w-6xl h-[90vh] flex flex-col lg:flex-row items-center justify-center gap-5 mx-auto">
        {/* Text Section */}
        <div className="text-center max-w-2xl">
          <h1 className="text-5xl font-semibold tracking-tight text-balance text-gray-900 sm:text-7xl">
            Discover Your Wellness Journey
          </h1>
          <p className="mt-8 text-lg font-medium text-pretty text-gray-500 sm:text-xl/8">
            Connecting Mind, Body, and Spirit for a Happier You
          </p>
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <button
              className="rounded-md cursor-pointer bg-[rgb(153,39,135)] px-3.5 py-2.5 text-sm font-semibold text-white shadow-xs hover:bg-[rgb(130,30,115)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[rgb(153,39,135)]"
              onClick={() => {
                toast.success("you need to login before booking...");
                setTimeout(() => {
                  navigate("/login");
                }, 1000);
              }}
            >
              Book A Wellness Event
            </button>
            <a href="#" className="text-sm font-semibold text-[rgb(153,39,135)] hover:underline">
              Learn More Wellness Event <span aria-hidden="true">→</span>
            </a>
          </div>
        </div>

        {/* Image Section */}
        <div
          className="h-[300px] w-full lg:w-[65%] bg-cover bg-center bg-no-repeat hidden sm:block rounded-lg shadow-lg"
          style={{
            backgroundImage:
              "url('https://thumbs.dreamstime.com/b/man-hiker-sitting-top-mountain-meeting-sunrise-harmony-nature-89161786.jpg')",
          }}
        ></div>
      </div>

      {/* Bottom Blurred Background */}
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-[calc(100%-13rem)] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[calc(100%-30rem)]"
      >
        <div
          style={{
            clipPath:
              'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
          }}
          className="relative left-[calc(50%+3rem)] aspect-1155/678 w-[36.125rem] -translate-x-1/2 bg-gradient-to-tr from-[rgb(153,39,135)] to-pink-300 opacity-30 sm:left-[calc(50%+36rem)] sm:w-[72.1875rem]"
        />
      </div>
    </>
  );
};

export default Hero;
