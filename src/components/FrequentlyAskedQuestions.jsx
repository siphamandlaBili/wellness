import { useState } from "react";
import React from "react";

const faqs = [
  {
    question: "What servics does Healthspace FMP Wellness offer for companies?",
    answer:
      "We offer a range of onsite and digital wellness services , including health screenings, chronic disease programmes, mental health support, wellness days, and vaccination drives - all linked to an Electronic Health Record (EHR) system.",
  },
  {
    question: "How is this different from a regular wellness provider?",
    answer:
      "Most wellness events are once-off events with no continuity. We intergrate your employees' health data directly into their medical histroy, helping healthcare providers make better decisions and improving long-term health outcomes.",
  },
  {
    question: "Can we server multiple branches or remote teams?",
    answer:
      "Yes. We offer onsite activations, virtual wellness weejs, and whatsaap-based wellness tools to ensure all teams - including remote workers - are covered",
  },
  {
    question: "Is it POPIA-compliant?",
    answer:
      "Absolutely. All patient data is securely stored,access-controlled, and fully POPIA compliant.",
  },
  {
    question: "How do we track ROI?",
    answer:
      "You'll recieve anonymized, easy-to-read reports on participation, risk trends, and suggested actions. Over time, this helps reduces absenteeism and chronic-related medical claims.",
  },
];

const FrequentlyAsked = () => {
  const [activeIndex, setActiveIndex] = useState(null);

  const toggleFAQ = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <section id="FAQ" className="mx-auto max-w-6xl p-6 my-12">
  <div
    aria-hidden="true"
    className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80 dark:opacity-20"
  >
    <div
      style={{
        clipPath:
          'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
      }}
      className="relative left-[calc(50%+3rem)] aspect-1155/678 w-[36.125rem] -translate-x-1/2 bg-gradient-to-tr from-[rgb(153,39,135)] to-pink-300 opacity-30 sm:left-[calc(50%+36rem)] sm:w-[72.1875rem] dark:from-purple-900 dark:to-pink-800"
    />
  </div>
  
  <h2 className="text-[rgb(153,39,135)] dark:text-purple-400 text-4xl text-center font-bold mb-10">
    Frequently Asked Questions
  </h2>

  <div className="space-y-6">
    {faqs.map((faq, index) => (
      <div key={index} className="border-b dark:border-gray-700 pb-4">
        <button
          className={`w-full flex justify-between items-center text-left text-lg font-medium transition-colors ${
            activeIndex === index 
              ? "text-[rgb(153,39,135)] dark:text-purple-300" 
              : "text-gray-800 dark:text-gray-300"
          }`}
          onClick={() => toggleFAQ(index)}
        >
          {faq.question}
          <span className="text-2xl dark:text-gray-400">
            {activeIndex === index ? "➖" : "➕"}
          </span>
        </button>
        <div
          className={`transition-all duration-300 ${
            activeIndex === index ? "max-h-40 mt-4" : "max-h-0 overflow-hidden"
          }`}
        >
          <p className="text-gray-600 dark:text-gray-400">{faq.answer}</p>
        </div>
      </div>
    ))}
  </div>

  <div
    aria-hidden="true"
    className="absolute inset-x-0 top-[calc(100%-13rem)] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[calc(100%-30rem)] dark:opacity-20"
  >
    <div
      style={{
        clipPath:
          'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
      }}
      className="relative left-[calc(50%+3rem)] aspect-1155/678 w-[36.125rem] -translate-x-1/2 bg-gradient-to-tr from-[rgb(153,39,135)] to-pink-300 opacity-30 sm:left-[calc(50%+36rem)] sm:w-[72.1875rem] dark:from-purple-900 dark:to-pink-800"
    />
  </div>
</section>
  );
};

export default FrequentlyAsked;
