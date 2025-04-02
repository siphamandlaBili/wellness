import React from 'react'
import image1 from "../assets/image.png";
import FrequentlyAsked from '../components/FrequentlyAskedQuestions.jsx';
import AboutSection from '../components/About.jsx';
import Hero from '../components/Hero.jsx';
import Navbar from '../components/Navbar.jsx';
import Footer from '../components/Footer.jsx';
const LandingPage = () => {


  return (
    <div className='max-w-full '>
    <Navbar/>
    <Hero/>
    <AboutSection/>
    <FrequentlyAsked/>
    <Footer/>
  </div>
  )
}

export default LandingPage
