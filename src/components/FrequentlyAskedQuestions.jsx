import { useState } from "react";
import React from "react";

const faqs = [
  {
    question: "Why is the moon sometimes out during the day?",
    answer:
      "The moon is visible during the day because its brightness can outshine the scattered sunlight when positioned favorably in the sky.",
  },
  {
    question: "Why is the sky blue?",
    answer:
      "The sky appears blue due to the scattering of sunlight by the atmosphere. The shorter blue wavelengths scatter more, making the sky look blue.",
  },
  {
    question: "Will we ever discover aliens?",
    answer:
      "The search for extraterrestrial life continues, but there is no confirmed discovery of aliens yet.",
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
        className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80"
      ></div>
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
      <h2 className="text-[rgb(153,39,135)] text-4xl text-center font-bold mb-10">
        Frequently Asked Questions
      </h2>

      <div className="space-y-6">
        {faqs.map((faq, index) => (
          <div key={index} className="border-b pb-4">
            <button
              className={`w-full flex justify-between items-center text-left text-lg font-medium ${
                activeIndex === index ? "text-[rgb(153,39,135)]" : "text-gray-800"
              }`}
              onClick={() => toggleFAQ(index)}
            >
              {faq.question}
              <span className="text-2xl">
                {activeIndex === index ? "➖" : "➕"}
              </span>
            </button>
            <div
              className={`transition-all duration-300 ${
                activeIndex === index ? "max-h-40 mt-4" : "max-h-0 overflow-hidden"
              }`}
            >
              <p className="text-gray-600">{faq.answer}</p>
            </div>
          </div>
        ))}
      </div>
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
    </section>
  );
};

export default FrequentlyAsked;
