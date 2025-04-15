import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import image1 from "../assets/image.png";
import FrequentlyAsked from '../components/FrequentlyAskedQuestions.jsx';
import AboutSection from '../components/About.jsx';
import Hero from '../components/Hero.jsx';
import Navbar from '../components/Navbar.jsx';
import Footer from '../components/Footer.jsx';

const LandingPage = () => {
  const [shouldAnimate, setShouldAnimate] = useState(true);

  return (
    <div className='max-w-full'>
      {/* Navbar with slide-down animation */}
      <motion.div
        initial={shouldAnimate ? { y: -100, opacity: 0 } : {}}
        animate={shouldAnimate ? { y: 0, opacity: 1 } : {}}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <Navbar />
      </motion.div>

      {/* Hero section with scale-up animation */}
      <motion.div
        initial={shouldAnimate ? { scale: 0.95, opacity: 0 } : {}}
        animate={shouldAnimate ? { scale: 1, opacity: 1 } : {}}
        transition={{ duration: 0.5, delay: 0.2, ease: "easeOut" }}
      >
        <Hero />
      </motion.div>

      {/* About section with slide-from-left animation */}
      <motion.div
        initial={shouldAnimate ? { x: -50, opacity: 0 } : {}}
        animate={shouldAnimate ? { x: 0, opacity: 1 } : {}}
        transition={{ duration: 0.5, delay: 0.4, ease: "easeOut" }}
      >
        <AboutSection />
      </motion.div>

      {/* FAQ section with slide-from-right animation */}
      <motion.div
        initial={shouldAnimate ? { x: 50, opacity: 0 } : {}}
        animate={shouldAnimate ? { x: 0, opacity: 1 } : {}}
        transition={{ duration: 0.5, delay: 0.6, ease: "easeOut" }}
      >
        <FrequentlyAsked />
      </motion.div>

      {/* Footer with fade-in animation */}
      <motion.div
        initial={shouldAnimate ? { opacity: 0 } : {}}
        animate={shouldAnimate ? { opacity: 1 } : {}}
        transition={{ duration: 0.5, delay: 0.8, ease: "easeOut" }}
      >
        <Footer />
      </motion.div>
    </div>
  );
};

export default LandingPage;